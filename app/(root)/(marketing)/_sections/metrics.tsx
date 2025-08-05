import { unstable_cache } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { Container } from '@/app/(root)/(marketing)/_components/container'
import { Icon } from '@/components/ui/icon'
import { FeaturedUser, fetchFeaturedUsers } from '@/lib/analytics/users/actions'
import { ONE_DAY_IN_SECONDS } from '@/lib/constants/revalidates'
import { getCount } from '@/lib/data/actions/get-count'
import { schema } from '@slat/db'
import { Marquee } from '../../../../components/ui/marquee'
import { AnimatedCounter } from '../_components/animated-counter'

function MetricsStats({
  label,
  fetcher,
  cacheKey,
}: {
  label: string
  fetcher: () => Promise<number>
  cacheKey: string
}) {
  return (
    <div className="self-end text-center font-mono lg:text-left">
      <div className="text-foreground text-sm whitespace-nowrap uppercase">{label}</div>
      <div className="text-primary text-4xl md:text-3xl">
        <React.Suspense fallback={<AnimatedCounter finalCount={0} />}>
          <SuspendedMetricValue fetcher={fetcher} cacheKey={cacheKey} />
        </React.Suspense>
      </div>
    </div>
  )
}

async function SuspendedMetricValue({ fetcher, cacheKey }: { fetcher: () => Promise<number>; cacheKey: string }) {
  const value = await unstable_cache(fetcher, [cacheKey], { revalidate: ONE_DAY_IN_SECONDS })()
  return <AnimatedCounter finalCount={value} />
}

export function Metrics() {
  async function fetchTotalViewsCount(): Promise<number> {
    return await getCount(schema.views)
  }

  async function fetchTotalLinksCount(): Promise<number> {
    return await getCount(schema.links)
  }

  async function fetchUsersCount(): Promise<number> {
    return await getCount(schema.users)
  }

  return (
    <Container className="flex max-w-(--breakpoint-2xl) flex-col items-center justify-center gap-x-24 gap-y-12 py-12 lg:flex-row lg:justify-between lg:py-4">
      <div className="relative grid shrink-0 grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-primary/20 pointer-events-none absolute top-0 left-1/3 size-1/3 blur-3xl" />
        <MetricsStats label="Users" fetcher={fetchUsersCount} cacheKey="total-users-count" />
        <MetricsStats label="Links Created" fetcher={fetchTotalLinksCount} cacheKey="total-links-count" />
        <MetricsStats label="Profile Views" fetcher={fetchTotalViewsCount} cacheKey="total-views-count" />
      </div>
      <div className="flex items-center justify-center">
        <React.Suspense fallback={<div />}>
          <SuspendedUsersMarquee />
        </React.Suspense>
      </div>
    </Container>
  )
}

async function SuspendedUsersMarquee() {
  const featuredUsers = await unstable_cache(fetchFeaturedUsers, ['featured-users'], {
    revalidate: ONE_DAY_IN_SECONDS,
  })()

  return (
    <Marquee speed="slow" scrollerClassName="gap-12">
      {featuredUsers.map((user: FeaturedUser) => (
        <UserCard key={user.username} user={user} />
      ))}
    </Marquee>
  )
}

function UserCard({ user }: { user: FeaturedUser }) {
  return (
    <li>
      <Link
        href={`/${user.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-4"
      >
        {user.avatar && (
          <Image
            src={user.avatar}
            unoptimized
            width={100}
            alt="profile picture"
            height={100}
            className="relative size-12 rounded-full object-cover group-hover:hidden"
          />
        )}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <div className="text-foreground truncate text-base leading-[1.6] font-medium">
              {user.name || user.username}
            </div>
            {user.verified && <Icon name="solar:verified-check-bold-duotone" className="size-5 text-blue-400" />}
          </div>
          <div className="text-sm leading-[1.6] font-normal">/{user.username}</div>
        </div>
      </Link>
    </li>
  )
}
