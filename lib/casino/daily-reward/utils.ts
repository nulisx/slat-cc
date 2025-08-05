import { add, isAfter } from 'date-fns'

export function hasDailyRewardCooldownExpired(lastClaimedAt: Date) {
  return isAfter(new Date(), add(lastClaimedAt, { days: 1 }))
}
