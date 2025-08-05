import { updateBalance } from '@/lib/casino/actions/update-balance'
import { wheelSegments } from '@/lib/casino/spin-the-wheel/constants'
import { SpinTheWheelPayload, SpinTheWheelResponse } from '@/lib/casino/spin-the-wheel/schemas'
import { notifyCasinoGameWebhook } from '@/lib/casino/webhook'
import { capitalizeEachWord } from '@/lib/utils'
import { DiscordWebhook } from '@/lib/webhook'
import { after } from 'next/server'

export async function handleSpinTheWheel({ input, user }: SpinTheWheelPayload): Promise<SpinTheWheelResponse> {
  const { betAmount, color } = input

  const landedSegment = wheelSegments[Math.floor(Math.random() * wheelSegments.length)]
  const win = landedSegment.color === color
  const payout = win ? betAmount * landedSegment.multiplier - betAmount : -betAmount

  const newBalance = await updateBalance({
    payout,
    userId: user.id,
    balance: user.coins,
  })

  after(async () => {
    await notifyCasinoGameWebhook({
      author: user,
      title: '🎡 Spin the Wheel',
      betAmount,
      description: '',
      oldBalance: user.coins,
      newBalance,
      payout,
      color: DiscordWebhook.colors.purple,
      fields: [
        {
          name: 'Guess',
          value: capitalizeEachWord(color),
          inline: true,
        },
      ],
    })
  })

  return {
    balance: newBalance,
    outcome: win ? 'win' : 'lose',
    color: landedSegment.color,
    payout,
  }
}
