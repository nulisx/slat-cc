import type { WeeklyComparison } from '@/lib/analytics/types'
import { isWithinInterval, subDays } from 'date-fns'

export const getHSLColor = (index: number): string => {
  const hslValue = (index % 5) + 1 // Cycle through 1 to 5
  return `var(--chart-${hslValue})`
}

export const getWeeklyComparison = (data: { createdAt: Date }[]): WeeklyComparison => {
  const today = new Date()
  const sevenDaysAgo = subDays(today, 7)
  const fourteenDaysAgo = subDays(today, 14)

  const thisWeek = data.filter((item) => isWithinInterval(item.createdAt, { start: sevenDaysAgo, end: today }))

  const lastWeek = data.filter((item) =>
    isWithinInterval(item.createdAt, { start: fourteenDaysAgo, end: sevenDaysAgo }),
  )

  const difference = thisWeek.length - lastWeek.length
  const percentageChange = lastWeek.length === 0 ? 0 : (difference / lastWeek.length) * 100

  return {
    thisWeek: thisWeek.length,
    lastWeek: lastWeek.length,
    difference,
    percentageChange,
  }
}
