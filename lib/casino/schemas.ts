import * as z from 'zod'

export const outcomeSchema = z.enum(['win', 'lose', 'tie'])

export type GameOutcome = z.infer<typeof outcomeSchema>

export const casinoResponseSchema = z.object({
  payout: z.number(),
  outcome: outcomeSchema,
  balance: z.number(),
})

export const casinoUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  coins: z.number(),
  lastClaimedAt: z.date().optional(),
})

export type CasinoUser = z.infer<typeof casinoUserSchema>

export const betAmountSchema = z.number().min(1, 'Bet amount must be at least 1.')
