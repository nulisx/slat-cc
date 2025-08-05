'use server'

import { getTemplate, sanitizeTemplate } from '@/lib/data/templates/actions'
import { unparseTags } from '@/lib/data/templates/utils'
import { SlatServerError } from '@/lib/errors'
import { withSession } from '@/lib/middleware/session'
import { templateFormSchema, type TemplateFormValues } from '@/lib/zod/schemas/template'
import type { Template as TemplateRow } from '@slat/db'
import { db, schema } from '@slat/db'
import { and, eq, isNull } from 'drizzle-orm'

export const updateTemplate = withSession(async (userId: number, data: { id: number; values: TemplateFormValues }) => {
  const validatedFields = templateFormSchema.parse(data.values)

  const template = await getTemplate({ userId, id: data.id })

  if (!template) {
    throw new SlatServerError({
      code: 'not_found',
      message: 'Template not found',
    })
  }

  await db.transaction(async (tx) => {
    await tx
      .update(schema.templates)
      .set({
        name: validatedFields.name,
        image: validatedFields.image,
        tags: unparseTags(validatedFields.tags),
        isPremiumRequired: !validatedFields.removePremiumFeatures,
        isPublic: validatedFields.isPublic,
      } satisfies Partial<TemplateRow>)
      .where(and(eq(schema.templates.id, template.id), eq(schema.templates.userId, userId)))

    if (validatedFields.applyCurrentCustomization) {
      const relatedTables = [schema.cards, schema.miscellanea, schema.biolinks]

      for (const table of relatedTables) {
        const userRecords = await tx
          .select()
          .from(table)
          .where(and(eq(table.userId, userId), isNull(table.templateId)))

        if (userRecords.length > 0) {
          for (const record of userRecords) {
            const { id, ...updatedRecord } = record

            const [existingTemplateRecord] = await tx
              .select()
              .from(table)
              .where(and(eq(table.templateId, template.id), isNull(table.userId)))

            if (existingTemplateRecord) {
              await tx
                .update(table)
                .set({
                  ...updatedRecord,
                  userId: null,
                })
                .where(and(eq(table.templateId, template.id), isNull(table.userId)))
            } else {
              await tx.insert(table).values({
                ...updatedRecord,
                userId: null,
                templateId: template.id,
              })
            }
          }
        }
      }
    }

    if (validatedFields.removePremiumFeatures) {
      await sanitizeTemplate(tx, template.id, userId)
    }
  })
})
