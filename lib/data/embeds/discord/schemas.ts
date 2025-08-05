import type { DiscordStatusRaw } from '@/lib/data/embeds/discord/types'
import * as z from 'zod'

export type DiscordStatus = DiscordStatusRaw | 'streaming'

export const discordActivityTypeSchema = z.enum(['STREAMING', 'LISTENING', 'PLAYING', 'WATCHING', 'CUSTOM'])

export type DiscordActivityType = z.infer<typeof discordActivityTypeSchema>

const discordActivitySchema = z.object({
  type: discordActivityTypeSchema,
  title: z.string(),
  details: z.string().optional(),
  emojiUrl: z.string().optional(),
  assetURL: z.string().optional(),
  startedAt: z.string().optional(),
})

export type DiscordActivity = z.infer<typeof discordActivitySchema>

const discordBadgeSchema = z.enum([
  'active-developer',
  'early-supporter',
  'house-balance',
  'house-bravery',
  'house-brilliance',
  'nitro',
  'server-booster',
])

export type DiscordBadge = z.infer<typeof discordBadgeSchema>

const discordPresenceSchema = z.object({
  userId: z.string(),
  username: z.string(),
  avatarUrl: z.string(),
  activity: discordActivitySchema.optional(),
  badges: z.array(discordBadgeSchema),
})

export type DiscordPresence = z.infer<typeof discordPresenceSchema> & {
  status: DiscordStatus
}

export const discordInviteSchema = z.object({
  code: z.string(),
  imageUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  onlineCount: z.number(),
  memberCount: z.number(),
  isCommunityServer: z.boolean(),
})

export type DiscordInvite = z.infer<typeof discordInviteSchema>
