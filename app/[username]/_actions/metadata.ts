import { WEBSITE } from '@/lib/config'
import { getMetadata } from '@/lib/data/metadata/actions'
import { getUserIdByUsername } from '@/lib/data/users/actions'
import { constructMetadata } from '@/lib/utils'
import type { Metadata } from 'next'

export async function generateBiolinkMetadata(username: string): Promise<Metadata | undefined> {
  const userId = await getUserIdByUsername(username)

  if (!userId) return

  const metadata = await getMetadata(userId)

  if (!metadata) return

  const { title, favicon, description } = metadata

  return constructMetadata({
    fullTitle: title,
    description,
    icons: [
      {
        url: favicon,
      },
    ],
    image: `${WEBSITE.baseUrl}/${username}/opengraph-image`,
    url: `${WEBSITE.baseUrl}/${username}`,
  })
}
