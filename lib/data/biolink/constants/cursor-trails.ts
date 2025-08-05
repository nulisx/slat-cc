import * as z from 'zod'
import { FieldOptionsWithPremium } from '@/lib/types'
import { unkebabCase } from '@/lib/utils'

export const cursorTrailSchema = z.enum([
  'line',
  'stardust',
  'falling-particles',
  'falling-stars',
  'bursts',
  'sparkles',
  'bubbles',
])

export type CursorTrail = z.infer<typeof cursorTrailSchema>

export const cursorTrailOptions = cursorTrailSchema.options.map((value) => ({
  label: unkebabCase(value),
  value,
  premium: true,
})) satisfies FieldOptionsWithPremium<CursorTrail>

export function parseCursorTrail(value: unknown): CursorTrail | undefined {
  try {
    return cursorTrailSchema.parse(value)
  } catch (error) {
    return undefined
  }
}
