'use server'

import { colorSchema } from '@/lib/data/schemas'
import { withSession } from '@/lib/middleware/session'
import type { Link as LinkRow } from '@slat/db'
import { db, schema } from '@slat/db'
import { eq } from 'drizzle-orm'

export const updateLinkColors = withSession(
  async (userId: number, args: { iconColor: string; backgroundColor?: string }) => {
    const validatedIconColor = colorSchema.parse(args.iconColor)

    const values: Partial<LinkRow> = {
      iconColor: validatedIconColor,
      backgroundColor: colorSchema.safeParse(args.backgroundColor).data ?? null,
    }

    await db.update(schema.links).set(values).where(eq(schema.links.userId, userId))
  },
)
