import { Skeleton, SkeletonContent } from '@/components/ui/skeleton'
import { AnalyticsViewsChart } from './analytics-views-chart'
import { AnalyticsClicksChart } from './analytics-clicks-chart'
import type { AnalyticsArgs } from '@/lib/analytics/types'
import { fetchAnalytics } from '@/lib/analytics/actions'

export async function AnalyticsChartCards({ args }: { args: AnalyticsArgs }) {
  const data = await fetchAnalytics(args)

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
      <div className="h-auto space-y-4 xl:col-span-3">
        <AnalyticsViewsChart data={data.views} args={args} />
      </div>
      <div className="h-auto xl:col-span-2">
        <AnalyticsClicksChart data={data.clicks} />
      </div>
    </div>
  )
}

export function AnalyticsChartCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
      <Skeleton className="h-[250px] space-y-4 p-3 xl:col-span-3">
        <div className="flex items-center justify-between gap-4">
          <SkeletonContent className="h-7 w-1/3" />
          <SkeletonContent className="h-6 w-24" />
        </div>
        <SkeletonContent className="h-4 w-2/3" />
        <SkeletonContent className="h-[100px] w-full" />
      </Skeleton>
      <Skeleton className="h-[250px] space-y-4 p-3 xl:col-span-2">
        <SkeletonContent className="h-8 w-1/5" />
        <SkeletonContent className="h-[50px] w-full" />
      </Skeleton>
    </div>
  )
}
