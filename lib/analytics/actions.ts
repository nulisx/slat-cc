import { fetchViewsAnalytics } from '@/lib/analytics/views/actions'
import { getClicksAnalytics } from '@/lib/analytics/clicks/actions/get-clicks-analytics'
import type { Analytics, AnalyticsArgs } from '@/lib/analytics/types'

export async function fetchAnalytics(args: AnalyticsArgs): Promise<Analytics> {
  const [views, clicks] = await Promise.all([fetchViewsAnalytics(args), getClicksAnalytics(args)])

  return {
    views,
    clicks,
  }
}
