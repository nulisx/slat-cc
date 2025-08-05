import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { match } from 'ts-pattern'

import { GameInterface } from '@/app/casino/_components/game-interface'
import { DailyRewardGame } from '@/lib/casino/daily-reward/daily-reward-game'
import { DiceRollGame } from '@/lib/casino/dice-roll/dice-roll-game'
import { RangeRouletteGame } from '@/lib/casino/range-roulette/range-roulette-game'
import { RockPaperScissorsGame } from '@/lib/casino/rock-paper-scissors/rock-paper-scissors-game'
import { SlotMachineGame } from '@/lib/casino/slot-machine/slot-machine-game'
import { SpinTheWheelGame } from '@/lib/casino/spin-the-wheel/spin-the-wheel-game'

import CasinoLobby from '@/app/casino/_components/casino-lobby-page'
import { getCasinoUser } from '@/lib/casino/actions/get-casino-user'
import { casinoGames } from '@/lib/casino/constants'
import type { CasinoGame } from '@/lib/casino/types'
import { constructMetadata } from '@/lib/utils'

interface Params {
  slug?: string[]
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata | undefined> {
  const { slug } = await props.params

  if (!slug || slug.length === 0)
    return constructMetadata({
      title: 'Lobby',
      description: 'Welcome to the casino lobby! Choose a game to play.',
    })

  const casinoGame = casinoGames.find((casinoGame) => casinoGame.slug === slug[0])

  if (!casinoGame) return

  return constructMetadata({
    title: casinoGame.name,
    description: casinoGame.description,
  })
}

function getGameComponent(game: CasinoGame): React.ComponentType<{ game: CasinoGame; lastClaimedAt?: Date }> {
  return match(game.slug)
    .returnType<React.ComponentType<{ game: CasinoGame; lastClaimedAt?: Date }>>()
    .with('daily-reward', () => DailyRewardGame)
    .with('dice-roll', () => DiceRollGame)
    .with('spin-the-wheel', () => SpinTheWheelGame)
    .with('slot-machine', () => SlotMachineGame)
    .with('rock-paper-scissors', () => RockPaperScissorsGame)
    .with('range-roulette', () => RangeRouletteGame)
    .exhaustive()
}

export default async function CasinoPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params

  if (!slug || slug.length === 0) {
    return <CasinoLobby />
  }

  const casinoGame = casinoGames.find((casinoGame) => casinoGame.slug === slug[0])

  if (!casinoGame) {
    return notFound()
  }

  const user = await getCasinoUser()
  const GameComponent = getGameComponent(casinoGame)

  return (
    <GameInterface
      user={user}
      name={casinoGame.name}
      game={<GameComponent game={casinoGame} lastClaimedAt={user?.lastClaimedAt ?? undefined} />}
      hue={casinoGame.hue}
      hexColor={casinoGame.color}
    />
  )
}
