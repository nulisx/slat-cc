export type CasinoGame = {
  name: string
  description: string
  rules: string
  slug: 'daily-reward' | 'dice-roll' | 'spin-the-wheel' | 'slot-machine' | 'rock-paper-scissors' | 'range-roulette'
  icon: string
  hue: number
  color: string
}

export type CasinoUser = {
  id: number
  balance: number
  username: string
  lastClaimedAt?: Date
}
