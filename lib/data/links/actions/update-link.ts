'use server'

import { selectLinks } from '@/lib/data/links/actions'
import { formatLink } from '@/lib/data/links/format'
import { SlatServerError } from '@/lib/errors'
import { withSession } from '@/lib/middleware/session'
import { LinkFormValues, linkFormSchema } from '@/lib/zod/schemas/link'
import type { Link as LinkRow } from '@slat/db'
import { db, schema } from '@slat/db'
import { and, eq } from 'drizzle-orm'

export const updateLink = withSession(async (userId: number, args: { id: number; values: Partial<LinkFormValues> }) => {
  const [link] = await selectLinks({ where: { id: args.id, userId } })

  if (!link) {
    throw new SlatServerError({
      code: 'not_found',
      message: 'Link not found',
    })
  }

  const parsedValues = linkFormSchema.partial().parse(args.values)

  const values = { ...link, ...parsedValues } satisfies Partial<LinkRow>

  await db
    .update(schema.links)
    .set(values)
    .where(and(eq(schema.links.id, link.id), eq(schema.links.userId, userId)))

  const [updated] = await db
    .select()
    .from(schema.links)
    .where(and(eq(schema.links.id, link.id)))

  return {
    data: formatLink(updated),
  }
})
