import { DiscordBadge, DiscordPresence } from '@/lib/data/embeds/discord/schemas'
import {
  DiscordActivityRaw,
  DiscordBadgeRaw,
  DiscordStatusRaw
} from '@/lib/data/embeds/discord/types'
import { getActivity } from '@/lib/data/embeds/discord/utils'
import { kebabCase } from 'lodash'
import { ofetch } from 'ofetch'

type DiscordPresenceRaw = {
  listening_to_spotify: boolean
  discord_status: DiscordStatusRaw
  spotify: {
    track_id: string
    timestamps: {
      start: Date
      end: Date
    }
    song: string
    artist: string
    album: string
  }
  discord: {
    badges: DiscordBadgeRaw[] // e.g., 'Active Developer', 'Nitro'
    user: {
      id: string
      username: string
      avatar: string
      defaultAvatarURL: string
      avatarDecorationURL?: string
      avatarURL: string
      tag: string
      displayAvatarURL: string | null
    }
    id: string
    avatar: string
    boosting_duration?: number
    activities: DiscordActivityRaw[]
  }
}

const baseUrl = 'https://presence.slat.cc'

export async function getDiscordPresence(userId: string): Promise<DiscordPresence> {
  const { data } = await ofetch<{ data: DiscordPresenceRaw }>(`/user/${userId}`, {
    baseURL: baseUrl,
  })

  const activity = getActivity(data.discord.activities)
  const badges = data.discord.badges.map((b) => kebabCase(b)) as DiscordBadge[]
  const status = activity?.type === 'STREAMING' ? 'streaming' : data.discord_status

  const discordPresence: DiscordPresence = {
    userId: data.discord.id,
    username: data.discord.user.username,
    avatarUrl: data.discord.user.displayAvatarURL ?? data.discord.user.defaultAvatarURL, // gif discord.avatar
    activity,
    status,
    badges,
  }

  return discordPresence
}