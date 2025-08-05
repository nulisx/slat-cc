import * as z from 'zod'
import type { Template as TemplateRow } from '@slat/db'
import { urlSchema } from '@/lib/data/schemas'

const tagSchema = z
  .string()
  .regex(/^[a-zA-Z]+$/, { message: 'Tags can only contain letters.' })
  .max(10, { message: 'Tags must be 10 characters or less.' })

export const templateFields = {
  id: z.number(),
  name: z.string(),
  isPublic: z.boolean(),
  image: urlSchema,
  tags: z.array(tagSchema),
  isPremiumRequired: z.boolean(),
} satisfies Partial<Record<keyof TemplateRow, z.ZodTypeAny>>

export type TemplateField = keyof typeof templateFields

const authorSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string().optional(),
  avatar: urlSchema.optional(),
})

export const templateSchema = z.object({
  id: z.number(),
  name: templateFields.name,
  isPublic: templateFields.isPublic,
  image: templateFields.image.optional(),
  tags: templateFields.tags,
  isPremiumRequired: templateFields.isPremiumRequired,
  favoriteCount: z.number(),
  useCount: z.number(),
  isFavorited: z.boolean(),
  isUsed: z.boolean(),
  createdAt: z.date(),
  author: authorSchema,
})

export type Template = z.infer<typeof templateSchema>
