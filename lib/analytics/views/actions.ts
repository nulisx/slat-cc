import { db, schema } from '@slat/db'
import { and, eq, sql, desc, countDistinct } from 'drizzle-orm'
import type { ViewsAnalytics, ViewsAnalyticsRaw } from '@/lib/analytics/views/types'
import type { AnalyticsArgs } from '@/lib/analytics/types'
import { getWeeklyComparison } from '@/lib/analytics/utils'
import { getCountryAnalytics, getVisitorsAnalytics } from '@/lib/analytics/views/utils'

export async function fetchViewsAnalytics(args: AnalyticsArgs): Promise<ViewsAnalytics> {
  const data = await fetchViewsData(args)

  return {
    visitors: getVisitorsAnalytics(data, args.interval),
    weeklyComparison: getWeeklyComparison(data),
    countries: getCountryAnalytics(data),
  }
}

async function fetchViewsData(args: AnalyticsArgs): Promise<ViewsAnalyticsRaw[]> {
  return await db
    .select({
      createdAt: schema.views.createdAt,
      countryCode: schema.views.countryCode,
    })
    .from(schema.views)
    .where(
      and(
        eq(schema.views.biolinkId, args.biolinkId),
        sql.raw(`created_at >= DATE_SUB(NOW(), INTERVAL ${args.interval.days} DAY)`)
      )
    )
    .orderBy(desc(schema.views.createdAt))
}
