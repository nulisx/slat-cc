'use server'

import { enforceUsageLimit } from '@/lib/data/actions/enforce-usage-limit'
import { sanitizeTemplate } from '@/lib/data/templates/actions'
import { unparseTags } from '@/lib/data/templates/utils'
import { isPremium } from '@/lib/data/users/actions'
import { SlatServerError } from '@/lib/errors'
import { withSession } from '@/lib/middleware/session'
import { templateFormSchema, type TemplateFormValues } from '@/lib/zod/schemas/template'
import { db, schema } from '@slat/db'
import { eq } from 'drizzle-orm'

type TemplateInsert = typeof schema.templates.$inferInsert

export const createTemplate = withSession(async (userId: number, values: TemplateFormValues) => {
  const validatedFields = templateFormSchema.parse(values)

  if (validatedFields.isPublic && !validatedFields.image) {
    throw new SlatServerError({
      code: 'bad_request',
      message: 'Image is required for public templates',
    })
  }

  const premium = await isPremium(userId)

  await enforceUsageLimit({
    resource: 'templates',
    userId,
    limits: { free: 5, premium: 10 },
  })

  await db.transaction(async (tx) => {
    const [{ insertId }] = await tx.insert(schema.templates).values({
      userId,
      name: validatedFields.name,
      image: validatedFields.image,
      tags: unparseTags(validatedFields.tags),
      isPremiumRequired: premium ? true : false,
      isPublic: validatedFields.isPublic,
    } satisfies TemplateInsert)

    const relatedTables = [schema.cards, schema.miscellanea, schema.biolinks]

    for (const table of relatedTables) {
      const records = await tx.select().from(table).where(eq(table.userId, userId))

      if (records.length > 0) {
        const newRecords = records.map(({ id, ...record }) => ({
          ...record,
          userId: null,
          templateId: insertId,
        }))

        await tx.insert(table).values(newRecords)
      }
    }

    if (validatedFields.removePremiumFeatures) {
      await sanitizeTemplate(tx, insertId, userId)
    }
  })
})
