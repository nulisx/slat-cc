import { casinoResponseSchema, casinoUserSchema } from '@/lib/casino/schemas'
import * as z from 'zod'

const balloonSchema = z.object({
  id: z.number(),
  popped: z.boolean(),
  reward: z.number(),
  hue: z.number(),
})

export type Balloon = z.infer<typeof balloonSchema>

export const dailyRewardPayloadSchema = z.object({
  user: casinoUserSchema,
})

export type DailyRewardPayload = z.infer<typeof dailyRewardPayloadSchema>

export const dailyRewardResponseSchema = z.object({ rewards: z.array(z.number()) }).merge(casinoResponseSchema)

export type DailyRewardResponse = z.infer<typeof dailyRewardResponseSchema>
