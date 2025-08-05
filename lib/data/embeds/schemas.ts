import type { Embed as EmbedRow } from '@/lib/drizzle'
import * as z from 'zod'

export const embedStatusSchema = z.enum(['gray', 'green', 'yellow', 'red', 'purple'])

export type EmbedStatus = z.infer<typeof embedStatusSchema>

export const embedFields = {
  id: z.coerce.number(),
  userId: z.coerce.number(),
  content: z.coerce.string(),
  secondStyle: z.coerce.boolean(),
  sortOrder: z.coerce.number(),
  insideProfileCard: z.coerce.boolean(),
  compactLayout: z.coerce.boolean(),
} satisfies Record<keyof EmbedRow, z.ZodTypeAny>

export type EmbedField = keyof typeof embedFields

export const embedSchema = z.object({
  id: embedFields.id,
  content: embedFields.content,
  secondStyle: embedFields.secondStyle,
  insideProfileCard: embedFields.insideProfileCard,
  compactLayout: embedFields.compactLayout,
})

export type Embed = z.infer<typeof embedSchema>

export type EmbedFieldFeature = Extract<keyof typeof embedFields, 'secondStyle' | 'insideProfileCard' | 'compactLayout'>
