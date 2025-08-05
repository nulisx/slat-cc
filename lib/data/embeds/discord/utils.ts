import type { DiscordActivity, DiscordActivityType } from '@/lib/data/embeds/discord/schemas'
import type { DiscordActivityRaw } from '@/lib/data/embeds/discord/types'
import { match } from 'ts-pattern'

export function getActivity(data: DiscordActivityRaw[]): DiscordActivity | undefined {
  const types: DiscordActivityType[] = ['STREAMING', 'PLAYING', 'WATCHING', 'LISTENING', 'CUSTOM']

  const firstActivity = data[0]

  if (firstActivity) return formatActivity(firstActivity)

  for (const type of types) {
    const activity = data.find((activity) => activity.type === type)

    if (activity) return formatActivity(activity)
  }
}

function formatActivity(activity: DiscordActivityRaw): DiscordActivity | undefined {
  const isNumericString = (str: string) => /^\d+$/.test(str)

  const getActivityImageUrl = (activity: DiscordActivityRaw): string | undefined => {
    const { imageURL, assetKey } = activity.assets
    const { application_id, name } = activity

    if (name === 'Spotify' && imageURL) {
      return imageURL
    }

    if (application_id && assetKey && isNumericString(assetKey)) {
      return `https://cdn.discordapp.com/app-assets/${application_id}/${assetKey}.png`
    }
  }

  return match(activity.type)
    .returnType<DiscordActivity | undefined>()
    .with('STREAMING', 'LISTENING', 'PLAYING', 'WATCHING', () => ({
      type: activity.type,
      title: activity.details || activity.name,
      details: activity.state,
      assetURL: getActivityImageUrl(activity),
      startedAt: activity.timestamps?.start,
    }))
    .with('CUSTOM', () => ({
      type: activity.type,
      title: activity.emoji?.name && !activity.emoji?.url ? `${activity.emoji.name} ${activity.state}` : activity.state,
      emojiUrl: activity.emoji?.url,
      startedAt: activity.timestamps?.start,
    }))
    .otherwise(() => undefined)
}
