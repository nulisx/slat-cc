import { betAmountSchema, casinoResponseSchema, casinoUserSchema } from '@/lib/casino/schemas'
import * as z from 'zod'

const wheelColor = z.enum(['green', 'yellow', 'blue', 'pink'])

export type WheelColor = z.infer<typeof wheelColor>

export const spinTheWheelInputSchema = z.object({
  betAmount: betAmountSchema,
  color: wheelColor,
})

export type SpinTheWheelInput = z.infer<typeof spinTheWheelInputSchema>

export const spinTheWheelPayloadSchema = z.object({
  input: spinTheWheelInputSchema,
  user: casinoUserSchema,
})

export type SpinTheWheelPayload = z.infer<typeof spinTheWheelPayloadSchema>

export const spinTheWheelResponseSchema = casinoResponseSchema.merge(
  z.object({
    color: wheelColor,
  }),
)

export type SpinTheWheelResponse = z.infer<typeof spinTheWheelResponseSchema>

const wheelSegmentSchema = z.object({
  color: wheelColor,
  multiplier: z.number(),
  hex: z.string(),
})

export type WheelSegment = z.infer<typeof wheelSegmentSchema>
