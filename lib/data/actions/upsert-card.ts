'use server'

import { db, schema } from '@slat/db'
import type { Card as CardRow } from '@slat/db'

export async function upsertCard(userId: number, args: Partial<CardRow>) {
  await db
    .insert(schema.cards)
    .values({ userId, ...args } satisfies Partial<CardRow>)
    .onDuplicateKeyUpdate({ set: args })
}
