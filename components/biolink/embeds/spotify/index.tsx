import { EmbedWrapper } from '@/components/biolink/embeds/embed-wrapper'
import type { EmbedProps, EmbedWithDetails } from '@/components/biolink/embeds/embed'
import { match } from 'ts-pattern'

type SpotifyEntityType = 'track' | 'album' | 'playlist' // the supported Spotify entity types

function getHeight(embed: EmbedWithDetails): number {
  return match(embed)
    .with({ type: 'spotify-track' }, () => 80)
    .with({ type: 'spotify-album', compactLayout: true }, () => 152)
    .with({ type: 'spotify-album', compactLayout: false }, () => 352)
    .with({ type: 'spotify-playlist', compactLayout: true }, () => 152)
    .with({ type: 'spotify-playlist', compactLayout: false }, () => 352)
    .otherwise(() => 152)
}

function getType(embed: EmbedWithDetails): SpotifyEntityType {
  return match(embed.type)
    .returnType<SpotifyEntityType>()
    .with('spotify-track', () => 'track')
    .with('spotify-album', () => 'album')
    .with('spotify-playlist', () => 'playlist')
    .otherwise(() => 'track')
}

export function SpotifyEmbed({ embed }: EmbedProps) {
  const theme = embed.secondStyle ? '0' : '1'
  const type = getType(embed)

  return (
    <EmbedWrapper>
      <iframe
        src={`https://open.spotify.com/embed/${type}/${embed.identifier}?utm_source=generator&theme=${theme}`}
        width="100%"
        height={getHeight(embed)}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        allowFullScreen
        style={{ borderRadius: '12px' }}
        title={`Spotify ${type}`}
      />
    </EmbedWrapper>
  )
}
