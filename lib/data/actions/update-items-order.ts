'use server'

import { db } from '@slat/db'
import { eq, and } from 'drizzle-orm'
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core'

type ReorderArgs<TTable extends MySqlTableWithColumns<any>> = {
  userId: number
  items: { id: number }[]
  table: TTable
}

export async function updateItemsOrder<TTable extends MySqlTableWithColumns<any>>({
  userId,
  items,
  table,
}: ReorderArgs<TTable>) {
  const ordered = items.map((item, index) => ({
    id: item.id,
    sortOrder: index + 1,
  }))

  for (const { id, sortOrder } of ordered) {
    await db
      .update(table)
      .set({ sortOrder })
      .where(and(eq(table.userId, userId), eq(table.id, id)))
  }
}
