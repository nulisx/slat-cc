import type { ViewsAnalytics } from '@/lib/analytics/views/types'
import type { ClicksAnalytics } from '@/lib/analytics/clicks/types'

export type ViewInterval = {
  value: string
  label: string
  days: number
}

export type AnalyticsArgs = {
  userId: number
  biolinkId: number
  interval: ViewInterval
}

export interface Analytics {
  views: ViewsAnalytics
  clicks: ClicksAnalytics
}

export type WeeklyComparison = {
  thisWeek: number
  lastWeek: number
  difference: number
  percentageChange: number
}
