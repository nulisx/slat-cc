import { MetadataRoute } from 'next'
import { WEBSITE } from '@/lib/config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: WEBSITE.name,
    short_name: WEBSITE.name,
    description: WEBSITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: WEBSITE.themeColor,
    icons: [
      {
        src: `${WEBSITE.baseUrl}/favicons/android-chrome-192x192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `${WEBSITE.baseUrl}/favicons/android-chrome-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
