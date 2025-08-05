import { AppPath } from '@/lib/constants/paths'
import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

const pathsToSitemap: Partial<Record<AppPath, number>> = {
  '/': 1,
  '/login': 0.9,
  '/register': 0.9,
  '/docs': 0.8,
  '/casino': 0.8,
  '/leaderboard': 0.7,
  '/dashboard': 0.7,
  '/terms-of-service': 0.7,
  '/privacy-policy': 0.7,
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = (await headers()).get('host') as string

  return Object.entries(pathsToSitemap).map(([path, priority]) => {
    return {
      url: `https://${domain}${path}`,
      lastModified: new Date(),
      priority,
    }
  })
}
