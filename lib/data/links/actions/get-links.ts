'use server'

import { withUserId } from '@/lib/auth/session'
import { selectLinks } from '@/lib/data/links/actions'
import { formatLink } from '@/lib/data/links/format'
import type { Link } from '@/lib/data/links/schemas'
import { schema } from '@slat/db'
import { asc } from 'drizzle-orm'

export async function getLinks(userId?: number): Promise<Link[]> {
  return withUserId(
    async (resolvedUserId) => {
      const links = await selectLinks({ where: { userId: resolvedUserId }, orderBy: asc(schema.links.sortOrder) })

      return links.map(formatLink)
    },
    {
      userId,
      fallback: () => [],
    },
  )
}
