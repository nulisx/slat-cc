import { z } from 'zod'

import {
  getYoutubeVideoId,
  getSpotifyContent,
  getSoundcloudContent,
  getDiscordInviteCode,
  getRobloxUserId,
  getTwitchChannel,
  getDiscordUserId,
  getSteamUserId,
  extractGithubUsername,
} from '@/lib/data/embeds/utils'
import { match } from 'ts-pattern'

const embedTypeSchema = z.enum([
  'github-profile',
  'discord-presence',
  'discord-invite',
  'youtube-video',
  'roblox-profile',
  'soundcloud-track',
  'soundcloud-playlist',
  'soundcloud-album',
  'twitch-channel',
  'steam-profile',
  'spotify-track',
  'spotify-album',
  'spotify-playlist',
])

export type EmbedType = z.infer<typeof embedTypeSchema>

const embedDetailsSchema = z.object({
  type: embedTypeSchema,
  identifier: z.string(),
})

export type EmbedDetails = z.infer<typeof embedDetailsSchema>

export function extractEmbedDetails(input: string): EmbedDetails | undefined {
  const extractors: Array<() => EmbedDetails | undefined> = [
    () => {
      const username = extractGithubUsername(input)
      if (username) return { type: 'github-profile', identifier: username }
    },
    () => {
      const youtubeId = getYoutubeVideoId(input)
      if (youtubeId) return { type: 'youtube-video', identifier: youtubeId }
    },
    () => {
      const userId = getRobloxUserId(input)
      if (userId) return { type: 'roblox-profile', identifier: userId }
    },
    () => {
      const code = getDiscordInviteCode(input)
      if (code) return { type: 'discord-invite', identifier: code }
    },
    () => {
      const channel = getTwitchChannel(input)
      if (channel) return { type: 'twitch-channel', identifier: channel }
    },
    () => {
      const userId = getDiscordUserId(input)
      if (userId) return { type: 'discord-presence', identifier: userId }
    },
    () => {
      const steamId = getSteamUserId(input)
      if (steamId) return { type: 'steam-profile', identifier: steamId }
    },
    () => {
      const content = getSoundcloudContent(input)

      if (!content) return

      return match(content.type)
        .returnType<EmbedDetails | undefined>()
        .with('tracks', () => ({ type: 'soundcloud-track', identifier: content.id }))
        .with('playlists', () => ({ type: 'soundcloud-playlist', identifier: content.id }))
        .with('albums', () => ({ type: 'soundcloud-album', identifier: content.id }))
        .otherwise(() => undefined)
    },
    () => {
      const content = getSpotifyContent(input)

      if (!content) return

      return match(content.type)
        .returnType<EmbedDetails | undefined>()
        .with('track', () => ({ type: 'spotify-track', identifier: content.id }))
        .with('album', () => ({ type: 'spotify-album', identifier: content.id }))
        .with('playlist', () => ({ type: 'spotify-playlist', identifier: content.id }))
        .otherwise(() => undefined)
    },
  ]

  for (const extract of extractors) {
    const result = extract()
    if (result) {
      const parsed = embedDetailsSchema.safeParse(result)
      if (parsed.success) return parsed.data
    }
  }
}
