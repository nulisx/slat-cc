import { colorSchema } from '@/lib/data/schemas'
import type { Link as LinkRow } from '@slat/db'
import * as z from 'zod'

export const linkStyleSchema = z.enum(['card', 'icon'])

export type LinkStyle = z.infer<typeof linkStyleSchema>

export const linkFields = {
  id: z.number(),
  platformId: z.number(),
  source: z.string(),
  iconName: z.string(),
  label: z.string(),
  style: linkStyleSchema,
  hidden: z.boolean(),
  image: z.string().url(),
  sortOrder: z.number(),
  iconColor: colorSchema,
  backgroundColor: colorSchema,
} satisfies Partial<Record<keyof LinkRow, z.ZodTypeAny>>

export type LinkField = keyof typeof linkFields

export const linkSchema = z.object({
  id: linkFields.id,
  platformId: linkFields.platformId.optional(),
  source: linkFields.source,
  iconName: linkFields.iconName,
  label: linkFields.label,
  style: linkFields.style,
  hidden: linkFields.hidden,
  image: linkFields.image.optional(),
  iconColor: linkFields.iconColor.optional(), // if not provided, defaults to theme color
  backgroundColor: linkFields.backgroundColor.optional(),
} satisfies Partial<Record<LinkField, z.ZodTypeAny>>)

export type Link = z.infer<typeof linkSchema>
