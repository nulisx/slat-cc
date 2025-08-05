import type { DiscordActivityType } from '@/lib/data/embeds/discord/schemas'

export type DiscordStatusRaw = 'offline' | 'online' | 'idle' | 'dnd'

export enum DiscordBadgeRaw {
  ActiveDeveloper = 'Active Developer',
  Nitro = 'Nitro',
  EarlySupporter = 'Early Supporter',
  HouseBalance = 'House Balance',
  HouseBravery = 'House Bravery',
  HouseBrilliance = 'House Brilliance',
  ServerBooster = 'Server Booster',
}

export type DiscordActivityRaw = {
  type: DiscordActivityType
  timestamps?: {
    start: string
    end: string
  }
  state: string
  name: string
  id: string
  details: string
  created_at: number
  assets: {
    largeImage: string
    largeText: string
    smallImage: string
    smallText: string
    assetKey?: string
    imageURL: string
  }
  application_id: string
  emoji?: {
    name?: string
    url?: string
  }
}