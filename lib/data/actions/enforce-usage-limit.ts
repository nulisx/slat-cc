import { isUndefined } from 'lodash'
import { schema } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'
import { getCount } from '@/lib/data/actions/get-count'
import { SlatServerError } from '@/lib/errors'
import { isPremium as fetchIsPremium } from '@/lib/data/users/actions'

type TablesWithUserId = {
  [K in keyof typeof schema]: 'userId' extends keyof (typeof schema)[K] ? K : never
}[keyof typeof schema]

type UsageLimits = {
  free: number
  premium: number
}

export async function enforceUsageLimit(args: {
  resource: TablesWithUserId
  userId: number
  limits: UsageLimits
  isPremium?: boolean
}): Promise<void> {
  const { resource, userId, limits } = args

  const [resolvedIsPremium, userCount] = await Promise.all([
    isUndefined(args.isPremium) ? fetchIsPremium(userId) : Promise.resolve(args.isPremium),
    getCount(schema[resource], eq(schema[resource].userId, userId)),
  ])

  const isPremium = resolvedIsPremium

  const allowedLimit = isPremium ? limits.premium : limits.free

  if (userCount >= allowedLimit) {
    throw new SlatServerError({
      code: 'exceeded_limit',
      message: `The limit of ${resource} (${allowedLimit}) for a ${
        isPremium ? 'premium' : 'free'
      } account has been reached.`,
    })
  }
}
