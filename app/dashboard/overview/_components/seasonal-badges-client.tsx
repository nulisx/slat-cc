'use client'

import { Icon } from '@/components/ui/icon'
import { Icons } from '@/lib/constants/icons'
import type { SeasonalBadge } from '@/lib/data/badges/schemas'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { claimBadge } from '@/lib/data/badges/actions'
import type { Badge } from '@/lib/data/badges/schemas'
import { useServerAction } from '@/lib/hooks/use-server-action'
import { match } from 'ts-pattern'

type BadgeState = 'owned' | 'claimable' | 'unavailable'

export function SeasonalBadgesClient({
  ownedBadges,
  seasonalBadges,
  claimableIds,
}: {
  ownedBadges: Badge[]
  seasonalBadges: SeasonalBadge[]
  claimableIds: number[]
}) {
  // filter out owned seasonal badges
  const ownedSeasonalBadges = ownedBadges.filter((badge) => seasonalBadges.some((b) => b.badgeId === badge.badgeId))
  const progress = (ownedSeasonalBadges.length / seasonalBadges.length) * 100

  const [scrollPosition, setScrollPosition] = React.useState(0)
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null)

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' })
      setScrollPosition(scrollPosition - 250)
    }
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' })
      setScrollPosition(scrollPosition + 250)
    }
  }

  const getState = (badge: SeasonalBadge): BadgeState => {
    const owned = ownedBadges.some((b) => b.badgeId === badge.badgeId)
    const claimable = claimableIds.includes(badge.badgeId)

    return match({ owned, claimable })
      .returnType<BadgeState>()
      .with({ owned: true }, () => 'owned')
      .with({ owned: false, claimable: true }, () => 'claimable')
      .otherwise(() => 'unavailable')
  }

  const stateOrder: Record<BadgeState, number> = {
    claimable: 0,
    owned: 1,
    unavailable: 2,
  }

  return (
    <div>
      <div className="relative flex items-center justify-between py-4">
        <Button
          variant="primary-solid"
          size="icon-sm"
          onClick={handleScrollLeft}
          className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full"
        >
          <Icons.chevronLeft className="size-4" />
        </Button>
        <Button
          variant="primary-solid"
          size="icon-sm"
          onClick={handleScrollRight}
          className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full"
        >
          <Icons.chevronRight className="size-4" />
        </Button>
        <div className="relative flex space-x-4 overflow-hidden px-16" ref={scrollContainerRef}>
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {seasonalBadges
              .map((sb) => ({
                ...sb,
                state: getState(sb),
              }))
              .sort((a, b) => stateOrder[a.state] - stateOrder[b.state])
              .map((sb, index) => (
                <SeasonalBadgeClaimButton key={index} badge={sb} />
              ))}
          </motion.div>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t p-4">
        <Progress value={progress} />
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {ownedSeasonalBadges.length} / {seasonalBadges.length} badges
        </span>
      </div>
    </div>
  )
}

function SeasonalBadgeClaimButton({ badge }: { badge: SeasonalBadge & { state: BadgeState } }) {
  const { run: claim, loading } = useServerAction(claimBadge, {
    toast: {
      success: `You have successfully claimed the ${badge.name} badge`,
    },
  })

  const onClaim = async () => {
    await claim(badge.badgeId)
  }

  const buttonClass: Record<BadgeState, string> = {
    claimable: 'animate-pulse border-sky-500/10 bg-sky-500/20 hover:bg-sky-500/30',
    owned: 'border-green-500/10 bg-green-500/10 hover:bg-green-500/20',
    unavailable: 'text-foreground border-neutral-800 bg-neutral-900 opacity-50',
  }

  return (
    <button
      onClick={onClaim}
      disabled={loading || badge.state !== 'claimable'}
      className={cn(
        'flex shrink-0 items-center gap-2 rounded-full border-2 py-2 pr-4 pl-2 text-sm font-medium transition',
        buttonClass[badge.state],
      )}
    >
      <div
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full p-1.5 text-white',
          badge.state === 'owned' && 'bg-green-600',
          badge.state === 'claimable' && 'bg-sky-500',
          badge.state === 'unavailable' && 'bg-white/20',
        )}
      >
        {badge.state === 'owned' ? <Icons.check className="h-3 w-3" /> : <Icons.question className="h-3 w-3" />}
      </div>
      <Icon name={badge.icon} className="h-5 w-5 text-white" />
      <span className="text-foreground">
        {badge.state === 'owned' ? badge.name : badge.state === 'claimable' ? 'Claim' : '???'}
      </span>
    </button>
  )
}
