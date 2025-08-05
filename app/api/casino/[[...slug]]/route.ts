import { withUser } from '@/lib/api/middleware/user'
import { parseRequestBody } from '@/lib/api/utils'
import { casinoGames } from '@/lib/casino/constants'
import { handleDailyReward } from '@/lib/casino/daily-reward/daily-reward'
import { DailyRewardPayload } from '@/lib/casino/daily-reward/schemas'
import { handleDiceRoll } from '@/lib/casino/dice-roll/dice-roll'
import { diceRollInputSchema, DiceRollPayload } from '@/lib/casino/dice-roll/schemas'
import { handleRangeRoulette } from '@/lib/casino/range-roulette/range-roulette'
import { rangeRouletteInputSchema, RangeRoulettePayload } from '@/lib/casino/range-roulette/schemas'
import { handleRps } from '@/lib/casino/rock-paper-scissors/rock-paper-scissors'
import { rpsInputSchema, RpsPayload } from '@/lib/casino/rock-paper-scissors/schemas'
import { slotMachineInputSchema, SlotMachinePayload } from '@/lib/casino/slot-machine/schemas'
import { handleSlotMachine } from '@/lib/casino/slot-machine/slot-machine'
import { spinTheWheelInputSchema, SpinTheWheelPayload } from '@/lib/casino/spin-the-wheel/schemas'
import { handleSpinTheWheel } from '@/lib/casino/spin-the-wheel/spin-the-wheel'
import { SlatServerError } from '@/lib/errors'
import { isUndefined } from 'lodash'
import { NextResponse } from 'next/server'
import { match } from 'ts-pattern'
import * as z from 'zod'

/** POST /api/casino/:slug - Handles various casino game actions based on the slug */
export const POST = withUser(async ({ user, params, req }) => {
  const { slug } = await params

  if (!slug || slug.length === 0) {
    throw new SlatServerError({
      code: 'bad_request',
      message: 'Invalid slug provided.',
    })
  }

  const game = casinoGames.find((g) => g.slug === slug[0])

  if (!game) {
    throw new SlatServerError({
      code: 'not_found',
      message: 'Game not found.',
    })
  }

  let data: unknown

  try {
    data = await parseRequestBody(req)
  } catch (error) {}

  const response = await match(game.slug)
    .with('daily-reward', async () => {
      const payload: DailyRewardPayload = { user }

      return await handleDailyReward(payload)
    })
    .with('dice-roll', async () => {
      const input = handleInputValidation(diceRollInputSchema, data, user.coins)
      const mergedPayload: DiceRollPayload = { input, user }

      return await handleDiceRoll(mergedPayload)
    })
    .with('spin-the-wheel', async () => {
      const input = handleInputValidation(spinTheWheelInputSchema, data, user.coins)
      const mergedPayload: SpinTheWheelPayload = { input, user }

      return await handleSpinTheWheel(mergedPayload)
    })
    .with('slot-machine', async () => {
      const input = handleInputValidation(slotMachineInputSchema, data, user.coins)
      const mergedPayload: SlotMachinePayload = { input, user }

      return await handleSlotMachine(mergedPayload)
    })
    .with('rock-paper-scissors', async () => {
      const input = handleInputValidation(rpsInputSchema, data, user.coins)
      const mergedPayload: RpsPayload = { input, user }

      return await handleRps(mergedPayload)
    })
    .with('range-roulette', async () => {
      const input = handleInputValidation(rangeRouletteInputSchema, data, user.coins)
      const mergedPayload: RangeRoulettePayload = { input, user }

      return await handleRangeRoulette(mergedPayload)
    })
    .exhaustive()

  return NextResponse.json(response)
})

function handleInputValidation<T extends z.ZodObject<any>>(schema: T, data: unknown, balance?: number): z.infer<T> {
  const parsed = schema.parse(data)

  if ('betAmount' in parsed && !isUndefined(balance)) {
    validateBetOrThrow(parsed.betAmount, balance)
  }

  return parsed
}

function validateBetOrThrow(betAmount: number, balance: number) {
  if (betAmount <= 0) {
    throw new SlatServerError({
      message: 'Please enter a valid bet amount',
      code: 'bad_request',
    })
  }

  if (betAmount > balance) {
    throw new SlatServerError({
      message: "You don't have enough coins",
      code: 'bad_request',
    })
  }
}
