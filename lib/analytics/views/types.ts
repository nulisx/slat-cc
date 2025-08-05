import { WeeklyComparison } from '@/lib/analytics/types'

export type ViewInterval = {}

// raw data from the database used to generate analytics
export type ViewsAnalyticsRaw = {
  createdAt: Date
  countryCode?: string | null
}

export type ViewsAnalytics = {
  weeklyComparison: WeeklyComparison
  visitors: VisitorsAnalytics
  countries: CountryAnalytics[]
}

export type CountryAnalytics = {
  name: string
  countryCode: string
  visitors: number
  fill: string
}

export type VisitorsAnalytics = {
  total: number
  average: number
  data: {
    date: string
    count: number
  }[]
}
