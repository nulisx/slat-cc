import { countries } from '@/lib/constants/countries'
import type { ViewInterval } from '@/lib/analytics/types'
import type { CountryAnalytics, VisitorsAnalytics, ViewsAnalyticsRaw } from '@/lib/analytics/views/types'
import { getHSLColor } from '@/lib/analytics/utils'
import { format, addDays } from 'date-fns'

export const viewIntervals = [
  {
    value: '365d',
    label: 'Last Year',
    days: 365,
  },
  {
    value: '180d',
    label: 'Last 6 Months',
    days: 180,
  },
  {
    value: '90d',
    label: 'Last 90 Days',
    days: 90,
  },
  {
    value: '30d',
    label: 'Last 30 Days',
    days: 30,
  },
] satisfies ViewInterval[]

export function getViewInterval(value?: string) {
  return viewIntervals.find((interval) => interval.value === value) ?? viewIntervals[viewIntervals.length - 1]
}

export function getCountryAnalytics(data: ViewsAnalyticsRaw[]): CountryAnalytics[] {
  const countryViewsMap: Record<string, number> = {}

  data.forEach(({ countryCode }) => {
    if (countryCode) {
      countryViewsMap[countryCode] = (countryViewsMap[countryCode] || 0) + 1
    }
  })

  return countries
    .map((country, index) => ({
      name: country.name,
      visitors: countryViewsMap[country.code] || 0,
      countryCode: country.code,
      fill: getHSLColor(index),
    }))
    .filter((country) => country.visitors > 0)
    .sort((a, b) => b.visitors - a.visitors)
}

export function getVisitorsAnalytics(data: { createdAt: Date }[], interval: ViewInterval): VisitorsAnalytics {
  const displayDate = (date: Date) => format(date, 'MMM d')

  const generateLastNDays = (days: number) => {
    const start = new Date()
    return Array.from({ length: days }, (_, i) => {
      const date = addDays(start, i - (days - 1))
      return displayDate(date)
    })
  }

  const lastNDays = generateLastNDays(interval.days)

  const chartData = lastNDays.map((date) => ({
    date,
    count: 0,
  }))

  data.forEach((view) => {
    const viewDate = displayDate(new Date(view.createdAt))
    const matchingDay = chartData.find((entry) => entry.date === viewDate)
    if (matchingDay) matchingDay.count += 1
  })

  const totalVisitors = chartData.reduce((sum, entry) => sum + entry.count, 0)
  const averageVisitors = Math.round(totalVisitors / chartData.length)

  return {
    total: totalVisitors,
    average: averageVisitors,
    data: chartData,
  }
}
