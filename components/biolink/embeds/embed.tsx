import { Biolink } from '@/lib/data/biolink/schemas'
import type { Embed } from '@/lib/data/embeds/schemas'
import { EmbedType, extractEmbedDetails, type EmbedDetails } from '@/lib/data/embeds/utils'
import { match } from 'ts-pattern'
import { DiscordInvite } from './discord/discord-invite'
import { DiscordPresence } from './discord/discord-presence'
import { GitHubProfile } from './github/github-profile'
import { RobloxProfile } from './roblox/roblox-profile'
import { SoundcloudEmbed } from './soundcloud'
import { SpotifyEmbed } from './spotify'
import { SteamProfile } from './steam/steam-profile'
import { TwitchChannel } from './twitch/twitch-channel'
import { YoutubeVideo } from './youtube/youtube-video'

type Colors = {
  text: string
  theme: string
  name: string
}

type MinimalEmbed = Omit<Embed, 'id'>

export type EmbedWithDetails = MinimalEmbed & EmbedDetails

// all embed components accepts these props
export interface EmbedProps {
  embed: EmbedWithDetails
  card: Biolink['card']
  container: Biolink['container']
  colors: Colors
  preview?: boolean
}

function getEmbedComponent(type: EmbedType): React.ComponentType<EmbedProps> {
  return match(type)
    .returnType<React.ComponentType<EmbedProps>>()
    .with('youtube-video', () => YoutubeVideo)
    .with('roblox-profile', () => RobloxProfile)
    .with('discord-invite', () => DiscordInvite)
    .with('twitch-channel', () => TwitchChannel)
    .with('discord-presence', () => DiscordPresence)
    .with('steam-profile', () => SteamProfile)
    .with('soundcloud-track', () => SoundcloudEmbed)
    .with('soundcloud-playlist', () => SoundcloudEmbed)
    .with('soundcloud-album', () => SoundcloudEmbed)
    .with('spotify-track', () => SpotifyEmbed)
    .with('spotify-album', () => SpotifyEmbed)
    .with('spotify-playlist', () => SpotifyEmbed)
    .with('github-profile', () => GitHubProfile)
    .exhaustive()
}

export function getEmbedCard(args: {
  isInsideProfileCard: boolean
  card: Biolink['card']
  container: Biolink['container']
}): Biolink['card'] {
  const { isInsideProfileCard, card, container } = args

  if (!isInsideProfileCard) return card

  const overrides = {
    shadowColor: '',
    shadowOpacity: 0,
    gradientAngle: 0,
    tilt: false,
    backgroundBlur: 0,
    backgroundColor: container.backgroundColor,
    backgroundColorSecondary: container.backgroundColor,
    backgroundOpacity: container.backgroundOpacity,
    borderColor: container.borderColor,
    borderOpacity: container.borderOpacity,
    borderRadius: card.borderRadius,
    borderWidth: container.borderWidth,
  } satisfies Biolink['card']

  return overrides
}

export function Embed({
  embed,
  card,
  container,
  colors,
  preview,
}: {
  embed: MinimalEmbed
  card: Biolink['card']
  container: Biolink['container']
  colors: Colors
  preview?: boolean
}) {
  const embedDetails = extractEmbedDetails(embed.content)

  if (embedDetails) {
    const Component = getEmbedComponent(embedDetails.type)
    const embedWithDetails: EmbedWithDetails = { ...embed, ...embedDetails }

    return <Component embed={embedWithDetails} card={card} container={container} colors={colors} preview={preview} />
  }

  if (preview) {
    return (
      <div className="border-destructive bg-destructive/5 text-foreground flex h-24 w-full flex-col items-center justify-center rounded-lg border border-dashed md:max-w-md">
        <div className="text-sm font-medium">Preview</div>
        <div className="text-xs">Invalid URL</div>
      </div>
    )
  }
}
