'use server'

import { enforceUsageLimit } from '@/lib/data/actions/enforce-usage-limit'
import { selectLinks } from '@/lib/data/links/actions'
import { formatLink } from '@/lib/data/links/format'
import { withSession } from '@/lib/middleware/session'
import { linkFormSchema, type LinkFormValues } from '@/lib/zod/schemas/link'
import { db, schema } from '@slat/db'

type LinkInsert = typeof schema.links.$inferInsert

export const createLink = withSession(async (userId: number, values: LinkFormValues) => {
  const validatedFields = linkFormSchema.parse(values)

  await enforceUsageLimit({
    resource: 'links',
    userId,
    limits: { free: 15, premium: 30 },
  })

  const [{ insertId }] = await db.insert(schema.links).values({ userId, ...validatedFields } satisfies LinkInsert)

  const [inserted] = await selectLinks({ where: { id: insertId } })

  return {
    data: formatLink(inserted),
  }
})
