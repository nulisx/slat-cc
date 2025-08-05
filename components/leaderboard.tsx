import { Pagination } from '@/components/pagination'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchLeaderboard } from '@/lib/analytics/leaderboard/actions'
import { leaderboardCategoryOptions } from '@/lib/analytics/leaderboard/constants'
import type { LeaderboardCategory, LeaderboardUser } from '@/lib/analytics/leaderboard/schemas'
import { Icons } from '@/lib/constants/icons'
import { formatLargeNumber } from '@/lib/utils'
import { unstable_cache } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

const getLeaderboardCached = unstable_cache(
  async (category: LeaderboardCategory, page: number) => {
    return await fetchLeaderboard(category, {
      page,
      limit: 10,
    })
  },
  ['leaderboard'],
  { revalidate: 3600 * 24 },
)

async function TableRows({ category, pageNumber }: { category: LeaderboardCategory; pageNumber: number }) {
  const data = await getLeaderboardCached(category, pageNumber)
  return (
    <div className="w-full space-y-2">
      {data.map((user, idx) => (
        <TableRow key={idx} user={user} />
      ))}
    </div>
  )
}

function TableHeader({ category }: { category?: LeaderboardCategory }) {
  return (
    <div className="group flex h-full w-full items-center justify-between pl-4">
      <div className="flex items-center">
        <div className="py-1.5 text-center text-xs">#</div>
        <div className="ml-2 text-xs">User</div>
      </div>
      <div className="flex items-center gap-2">
        {leaderboardCategoryOptions.map((option) => {
          if (category === option.value) {
            return (
              <Link key={option.value} href={`?category=${option.value === 'views' ? 'coins' : 'views'}`} passHref>
                <Card className="flex flex-row items-center gap-x-1 rounded-md p-1.5 pl-2 duration-300 hover:opacity-80">
                  <span className="text-foreground text-xs">{option.label}</span>
                  <Icons.chevronsUpDown className="text-muted-foreground ml-auto size-3" />
                </Card>
              </Link>
            )
          }
        })}
      </div>
    </div>
  )
}

function TableRow({ user, loading = false }: { user?: LeaderboardUser; loading?: boolean }) {
  return (
    <Link
      href={`/${user?.username}`}
      data-disabled={!user}
      target="_blank"
      rel="noopener noreferrer"
      passHref
      className="block w-full"
    >
      <Card className="flex w-full flex-row items-center justify-between gap-4 rounded-xl p-3">
        <div className="flex h-full items-center gap-4">
          <div className="bg-muted flex size-6 items-center justify-center rounded-full">
            {user ? <span className="text-xs">{user.rank}</span> : <Skeleton className="mx-auto h-3 w-6" />}
          </div>
          <div className="flex items-center gap-2">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                width={32}
                height={32}
                className="size-7 shrink-0 rounded-full"
              />
            ) : (
              loading && <Skeleton className="size-7 rounded-full" />
            )}
            {user ? (
              <div className="text-sm font-medium text-white">{user.name || user.username}</div>
            ) : (
              <Skeleton className="ml-2 h-3 w-20" />
            )}
          </div>
        </div>
        <div className="flex h-full w-16 items-center justify-center text-white">
          {user ? (
            <span className="text-xs font-medium">
              {formatLargeNumber(user.stats, {
                abbreviation: true,
              })}
            </span>
          ) : (
            <Skeleton className="h-3 w-10" />
          )}
        </div>
      </Card>
    </Link>
  )
}

export function LeaderboardTable({ category, page }: { category: LeaderboardCategory; page?: string }) {
  const currentPage = Number(page) || 1
  const maxPages = 10
  const pageNumber = Math.max(1, Math.min(currentPage, maxPages))

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <TableHeader category={category} />
      <React.Suspense
        key={category + pageNumber}
        fallback={
          <div className="w-full space-y-2">
            {Array.from({ length: 10 }, (_, idx) => (
              <TableRow key={idx} loading />
            ))}
          </div>
        }
      >
        <TableRows category={category} pageNumber={pageNumber} />
      </React.Suspense>
      <Pagination maxPages={maxPages} page={pageNumber} category={category} />
    </div>
  )
}
