import type { CasinoGame } from '@/lib/casino/types'

export const casinoGames: Readonly<CasinoGame[]> = [
  {
    name: 'Daily Reward',
    description: 'Pop the balloons to claim your daily reward! You can claim your reward once a day.',
    rules: 'Pop the balloons to claim your daily reward!',
    slug: 'daily-reward',
    icon: 'mdi:balloon',
    hue: 200,
    color: '#16A34A', // green
  },
  {
    name: 'Dice Roll',
    description: 'Test your luck! Guess if the result will be lower (1-3) or higher (4-6).',
    rules: 'Guess if the result will be lower (1-3) or higher (4-6).',
    slug: 'dice-roll',
    icon: 'ph:dice-six-duotone',
    hue: 300,
    color: '#1E8DF7', // blue
  },
  {
    name: 'Spin the Wheel',
    description: 'Test your luck! Spin the wheel and win big!',
    rules: 'Guess on a color and spin the wheel. If the wheel lands on your color, you win!',
    slug: 'spin-the-wheel',
    icon: 'solar:wheel-bold-duotone',
    hue: 50,
    color: '#F59E0B', // yellow
  },
  {
    name: 'Slot Machine',
    description: 'Test your luck! Spin the reels and match symbols to win big!',
    rules: 'Match symbols to win!',
    slug: 'slot-machine',
    icon: 'mdi:slot-machine',
    hue: 140,
    color: '#DAA508', // yellow
  },
  {
    name: 'Rock Paper Scissors',
    description: 'Test your luck! Choose rock, paper, or scissors and beat the computer!',
    rules: 'Choose your weapon and beat the computer!',
    slug: 'rock-paper-scissors',
    icon: 'f7:scissors',
    hue: 100,
    color: '#F77C7C', // red
  },
  {
    name: 'Range Roulette',
    description: 'Test your luck! Place your bets on a number range and spin the wheel!',
    rules: 'Place your bets on a number range and spin the wheel!',
    slug: 'range-roulette',
    icon: 'fluent-emoji-high-contrast:pool-8-ball',
    hue: 350,
    color: '#4F46E5', // purple
  },
]
