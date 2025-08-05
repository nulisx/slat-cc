import { Metadata } from 'next'
import { WEBSITE } from '@/lib/config'

export function constructMetadata({
  title,
  fullTitle,
  templateTitle,
  description = WEBSITE.description,
  image = `${WEBSITE.baseUrl}/apple-touch-icon.png`,
  video,
  icons = [
    {
      rel: 'apple-touch-icon',
      sizes: '32x32',
      url: `${WEBSITE.baseUrl}/favicons/apple-touch-icon.png`,
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: `${WEBSITE.baseUrl}/favicons/favicon-32x32.png`,
    },
    {
      rel: 'icon',
      sizes: '16x16',
      url: `${WEBSITE.baseUrl}/favicons/favicon-16x16.png`,
    },
  ],
  url,
  canonicalUrl,
  noIndex = false,
  manifest,
}: {
  title?: string
  fullTitle?: string
  templateTitle?: string
  description?: string
  image?: string | null
  video?: string | null
  icons?: Metadata['icons']
  url?: string
  canonicalUrl?: string
  noIndex?: boolean
  manifest?: string | URL | null
} = {}): Metadata {
  return {
    title: fullTitle || {
      default: title || templateTitle || WEBSITE.name,
      template: `%s ─ ${templateTitle || WEBSITE.name}`,
    },
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: image,
      }),
      url,
      ...(video && {
        videos: video,
      }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: 'summary_large_image',
        images: [image],
      }),
      ...(video && {
        player: video,
      }),
    },
    icons,
    metadataBase: new URL(WEBSITE.baseUrl),
    ...((url || canonicalUrl) && {
      alternates: {
        canonical: url || canonicalUrl,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...(manifest && {
      manifest,
    }),
  }
}
