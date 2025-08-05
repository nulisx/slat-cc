'use server'

import { getUserId } from '@/lib/auth/session'
import { getTemplates } from '@/lib/data/templates/actions'
import type { FilterSearchParams } from '@/lib/data/templates/types'
import { buildSQLOrderByClause, buildSQLWhereClause } from '@/lib/data/templates/utils/server'
import { and } from 'drizzle-orm'

export async function getFilteredTemplates(filters: FilterSearchParams = {}) {
  const userId = await getUserId()

  const whereClause = buildSQLWhereClause(filters, userId)
  const orderByClause = buildSQLOrderByClause(filters)

  return getTemplates(and(...whereClause), orderByClause, userId, filters.page)
}
