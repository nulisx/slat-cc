'use server'

import { db, schema } from '@slat/db'
import { eq, and, SQL } from 'drizzle-orm'
import type { Link as LinkRow } from '@slat/db'

type LinkColumn = keyof LinkRow

type PickedLink<Cols extends readonly LinkColumn[] | undefined> = Cols extends readonly LinkColumn[]
  ? { [K in Cols[number]]: LinkRow[K] }
  : LinkRow

type selectLinksArgs<Cols extends readonly LinkColumn[] | undefined = undefined> = {
  where: Partial<LinkRow>
  select?: Cols
  orderBy?: SQL<unknown> | SQL<unknown>[]
}

export async function selectLinks<SelectCols extends readonly LinkColumn[] | undefined = undefined>(
  args: selectLinksArgs<SelectCols>
): Promise<PickedLink<SelectCols>[]> {
  const { where, select, orderBy } = args

  if (!where || Object.keys(where).length === 0) {
    throw new Error('Where conditions must be provided')
  }

  const conditions = Object.entries(where).map(([key, value]) => {
    const column = (schema.links as any)[key]
    if (!column) throw new Error(`Invalid column: ${key}`)
    return eq(column, value)
  })

  const selectedCols = select && select.length > 0 ? select : (Object.keys(schema.links) as LinkColumn[])

  const selects = Object.fromEntries(selectedCols.map((col) => [col, (schema.links as any)[col]]))

  const query = db
    .select(selects)
    .from(schema.links)
    .where(and(...conditions))

  if (orderBy) {
    query.orderBy(...(Array.isArray(orderBy) ? orderBy : [orderBy]))
  }

  const links = await query

  return links as PickedLink<SelectCols>[]
}
