'use server'

import { selectLinks } from '@/lib/data/links/actions'
import { SlatServerError } from '@/lib/errors'
import { withSession } from '@/lib/middleware/session'
import { db, schema } from '@slat/db'
import { and, eq } from 'drizzle-orm'

export const deleteLink = withSession(async (userId: number, linkId: number) => {
  const [link] = await selectLinks({ where: { userId, id: linkId } })

  if (!link) {
    throw new SlatServerError({
      code: 'not_found',
      message: 'Link not found',
    })
  }

  await db.delete(schema.links).where(and(eq(schema.links.userId, userId), eq(schema.links.id, link.id)))
})
