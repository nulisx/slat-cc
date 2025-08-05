'use client'

import type { Balloon, DailyRewardResponse } from '@/lib/casino/daily-reward/schemas'
import type { CasinoGame } from '@/lib/casino/types'
import { cn } from '@/lib/utils'
import { ofetch } from 'ofetch'
import * as React from 'react'

import { Button } from '@/app/casino/_components/game-button'
import { GameWrapper } from '@/app/casino/_components/game-wrapper'
import { dailyRewards } from '@/lib/casino/daily-reward/constants'
import { hasDailyRewardCooldownExpired } from '@/lib/casino/daily-reward/utils'
import { paths } from '@/lib/constants/paths'
import { useCasinoGame } from '@/lib/hooks/use-casino-game'
import { useCountdownTimer } from '@/lib/hooks/use-countdown-timer'

export const DailyRewardGame = ({ game, lastClaimedAt }: { game: CasinoGame; lastClaimedAt?: Date }) => {
  const timeLeft = useCountdownTimer({
    startTime: lastClaimedAt,
    durationInHours: 24,
  })

  const noCooldown = lastClaimedAt ? hasDailyRewardCooldownExpired(lastClaimedAt) : true

  const [isPlayable, setIsPlayable] = React.useState(noCooldown)
  const [balloons, setBalloons] = React.useState<Balloon[]>([])

  const {
    setBalance,
    balance,
    outcome,
    loading,
    message,
    setMessage,
    setLoading,
    setOutcome,
    prepareGame,
    handleError,
  } = useCasinoGame()

  const start = async () => {
    try {
      prepareGame()

      const { rewards } = await ofetch<DailyRewardResponse>(`${paths.casino.root}/${game.slug}`, {
        method: 'POST',
      })

      const balloons = (rewards ?? []).map((reward, idx) => ({
        id: idx + 1,
        popped: false,
        reward,
        hue: Math.floor(Math.random() * 360),
      }))

      setBalloons(balloons)
      setIsPlayable(true)
    } catch (e) {
      handleError(e)
    } finally {
      setLoading(false)
    }
  }

  const pop = async (balloon: Balloon) => {
    if (balloon.popped) return

    setBalance(balance + balloon.reward)

    setBalloons((prevBalloons) => {
      const updatedBalloons = prevBalloons.map((b) => (b.id === balloon.id ? { ...b, popped: true } : b))

      if (updatedBalloons.every((b) => b.popped)) {
        const payout = updatedBalloons.reduce((acc, b) => acc + b.reward, 0)
        setOutcome('win')
        setMessage(`You've claimed ${payout} coins.`)
      }

      return updatedBalloons
    })
  }

  return (
    <GameWrapper
      game={game}
      message={!noCooldown ? "You've claimed your reward." : message}
      outcome={outcome}
      matrixOptions={{
        color: !isPlayable ? 'red' : undefined,
        noRepeat: !isPlayable ? true : false,
        highlightMessage: !noCooldown ? `Please come back in ${timeLeft}.` : undefined,
      }}
    >
      <div className="flex w-full flex-col items-center justify-center text-center">
        {balloons.length === 0 ? (
          <>
            <RewardTable />
            <Button
              onClick={start}
              className="mt-4 bg-green-700"
              spanClassname="bg-green-600"
              disabled={!isPlayable || loading}
            >
              {loading ? 'Loading...' : 'Start'}
            </Button>
          </>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {balloons.map((balloon) => (
              <Ballon key={balloon.id} item={balloon} onClick={() => pop(balloon)} />
            ))}
          </div>
        )}
      </div>
    </GameWrapper>
  )
}

const Ballon = ({ item, onClick }: { item: Balloon; onClick: () => void }) => {
  return (
    <button
      key={item.id}
      className={cn(
        'relative grid h-16 w-16 place-content-center border-[3px] border-green-500 bg-green-700/50',
        item.popped && 'cursor-not-allowed border-yellow-300/50 bg-yellow-400/50',
      )}
      onClick={onClick}
      disabled={item.popped}
    >
      {!item.popped ? (
        <div
          className={cn('text-2xl')}
          style={{
            filter: `hue-rotate(${item.hue}deg)`,
          }}
        >
          🎈
        </div>
      ) : (
        <div className="text-[6px]">{item.reward} coins</div>
      )}
    </button>
  )
}

const RewardTable = () => {
  return (
    <>
      <h2 className="my-3 uppercase">Reward Chances</h2>
      <div className="h-px w-full bg-white/15 text-[8px]" />
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="border-b border-white/15 text-[8px]">
            <th className="py-2">Reward</th>
            <th className="block py-2 text-right">Chance</th>
          </tr>
        </thead>
        <tbody>
          {dailyRewards.map((reward, index) => {
            return (
              <tr key={index} className="border-b border-white/15 text-xs">
                <td className="py-2 text-left">{reward.value} coins</td>
                <td className="py-2 text-right">{reward.chance}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
