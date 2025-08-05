import * as z from 'zod'
import { FieldOptions } from '@/lib/types'
import { unkebabCase } from '@/lib/utils'

export const pageOverlaySchema = z.enum(['noise', 'retro', 'shooting-stars', 'dots', 'rain'])

export type PageOverlay = z.infer<typeof pageOverlaySchema>

export const pageOverlayOptions = pageOverlaySchema.options.map((value) => ({
  label: unkebabCase(value),
  value,
})) satisfies FieldOptions<PageOverlay>

export function parsePageOverlay(value: unknown): PageOverlay | undefined {
  try {
    return pageOverlaySchema.parse(value)
  } catch {
    return undefined
  }
}