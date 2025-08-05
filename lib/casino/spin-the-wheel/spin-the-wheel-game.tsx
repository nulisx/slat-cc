'use client'

import type { CasinoGame } from '@/lib/casino/types'
import { ofetch } from 'ofetch'
import * as React from 'react'

import { BetAmountInput } from '@/app/casino/_components/game-bet-amount-input'
import { Button } from '@/app/casino/_components/game-button'
import { GameWrapper } from '@/app/casino/_components/game-wrapper'
import { wheelSegments } from '@/lib/casino/spin-the-wheel/constants'
import type {
  SpinTheWheelInput,
  SpinTheWheelResponse,
  WheelColor,
  WheelSegment,
} from '@/lib/casino/spin-the-wheel/schemas'
import { paths } from '@/lib/constants/paths'
import { useCasinoGame } from '@/lib/hooks/use-casino-game'
import { RouletteWheel } from './roulette-wheel'

export const SpinTheWheelGame = ({ game }: { game: CasinoGame }) => {
  const [spinDegree, setSpinDegree] = React.useState(0)

  const {
    setBetAmount,
    setLoading,
    outcome,
    setOutcome,
    betAmount,
    message,
    loading,
    setBalance,
    prepareGame,
    handleError,
  } = useCasinoGame()

  const spinWheel = async (guess: WheelColor) => {
    try {
      prepareGame(betAmount)

      const { balance, outcome, color } = await ofetch<SpinTheWheelResponse>(`${paths.casino.root}/${game.slug}`, {
        method: 'POST',
        body: {
          betAmount,
          color: guess,
        } satisfies SpinTheWheelInput,
      })

      const segmentIdx = wheelSegments.findIndex((segment) => segment.color === color)
      const finalDegree = calculateFinalDegree(spinDegree, segmentIdx)

      setSpinDegree(finalDegree)

      await new Promise((resolve) => setTimeout(resolve, 1000)) // wheel spin duration

      setBalance(balance)
      setOutcome(outcome)
    } catch (e) {
      handleError(e)
    } finally {
      setLoading(false)
    }
  }

  const getSegmentMultiplier = (color: WheelSegment['color']): string => {
    const multipler = wheelSegments.find((segment) => segment.color === color)?.multiplier || 1
    return `${multipler}x`
  }

  return (
    <GameWrapper game={game} outcome={outcome} message={message}>
      <div className="flex w-full flex-col items-center justify-center text-center">
        <RouletteWheel segments={wheelSegments} degree={spinDegree} />
        <div className="mt-4 w-full space-y-3 p-4">
          <BetAmountInput value={betAmount} onChange={setBetAmount} disabled={loading} />
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => spinWheel('yellow')}
                disabled={loading}
                className="bg-yellow-600"
                spanClassname="bg-yellow-500"
              >
                Yellow {getSegmentMultiplier('yellow')}
              </Button>
              <Button
                onClick={() => spinWheel('blue')}
                disabled={loading}
                className="bg-blue-600"
                spanClassname="bg-blue-500"
              >
                Blue {getSegmentMultiplier('blue')}
              </Button>
            </div>
            <Button
              onClick={() => spinWheel('green')}
              disabled={loading}
              className="bg-green-600"
              spanClassname="bg-green-500"
            >
              Green {getSegmentMultiplier('green')}
            </Button>
          </div>
        </div>
      </div>
    </GameWrapper>
  )
}

const calculateFinalDegree = (initialDegree: number, segmentIdx: number): number => {
  const sectionSize = 360 / wheelSegments.length

  const thresholdStart = sectionSize * segmentIdx
  const thresholdEnd = thresholdStart + sectionSize

  // generate random degree within the segment range
  const degreeWithinSegment = Math.random() * (thresholdEnd - thresholdStart - 14) + thresholdStart + 7 // avoid boundaries with ±7 offset to avoid visual edge cases

  const totalSpins = Math.ceil(initialDegree / 360) + 5 // ensure it's higher than the initial degree
  const extraSpins = totalSpins * 360

  const finalDegree = extraSpins + degreeWithinSegment

  return -finalDegree // negative to rotate clockwise
}
