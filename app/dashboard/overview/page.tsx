import * as React from 'react'

import { PageLayout } from '@/components/layout/page-layout'
import { AnalyticsArgs } from '@/lib/analytics/types'
import { getViewInterval } from '@/lib/analytics/views/utils'
import { getViewsCount } from '@/lib/data/actions/get-views-count'
import { getCurrentUser } from '@/lib/data/users/actions/get-current-user'
import { formatLargeNumber } from '@/lib/utils'
import { FiHash } from 'react-icons/fi'
import { LuEye, LuUser } from 'react-icons/lu'
import { PiCoins } from 'react-icons/pi'
import { AccountDetailsCard } from './_components/account-details-card'
import { AnalyticsChartCards, AnalyticsChartCardsSkeleton } from './_components/analytics-charts'
import { CountriesAnalyticsCard, CountriesAnalyticsCardSkeleton } from './_components/analytics-countries-card'
import { SeasonalBadgesCard, SeasonalBadgesCardSkeleton } from './_components/seasonal-badges-card'
import { StatsCard, StatsCardSkeleton } from './_components/stats-card'

export const metadata = {
  title: 'Overview',
}

export default async function OverviewPage(props: {
  searchParams: Promise<{
    interval?: string
  }>
}) {
  const searchParams = await props.searchParams
  const user = await getCurrentUser()

  if (!user) return null

  const args: AnalyticsArgs = {
    biolinkId: user.biolinkId,
    userId: user.id,
    interval: getViewInterval(searchParams.interval),
  }

  return (
    <PageLayout className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <React.Suspense fallback={<StatsCardSkeleton />}>
          <ViewsStatsCard />
        </React.Suspense>
        <StatsCard value={user.id.toString()} label="User ID" icon={FiHash} />
        <StatsCard value={user.username} label="Username" icon={LuUser} />
        <StatsCard value={formatLargeNumber(user.coins).toString()} label="Casino Coins" icon={PiCoins} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-7">
        <React.Suspense fallback={<SeasonalBadgesCardSkeleton />}>
          <SeasonalBadgesCard userId={user.id} />
        </React.Suspense>
        <AccountDetailsCard user={user} />
      </div>
      <React.Suspense fallback={<AnalyticsChartCardsSkeleton />}>
        <AnalyticsChartCards args={args} />
      </React.Suspense>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <React.Suspense fallback={<CountriesAnalyticsCardSkeleton />}>
          <CountriesAnalyticsCard args={args} />
        </React.Suspense>
      </div>
    </PageLayout>
  )
}

async function ViewsStatsCard() {
  const views = await getViewsCount()

  return <StatsCard label="Views" value={views.toString()} icon={LuEye} />
}
