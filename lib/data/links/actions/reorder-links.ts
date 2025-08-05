'use server'

import { updateItemsOrder } from '@/lib/data/actions/update-items-order'
import type { Link } from '@/lib/data/links/schemas'
import { withSession } from '@/lib/middleware/session'
import { schema } from '@slat/db'

export const reorderLinks = withSession(async (userId: number, links: Link[]) => {
  await updateItemsOrder({ userId, items: links, table: schema.links })
})
