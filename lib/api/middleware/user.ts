import { verifySession } from '@/lib/auth/session'
import { isPremium } from '@/lib/data/users/actions'
import { db } from '@/lib/drizzle'
import { handleAndReturnErrorResponse, SlatServerError } from '@/lib/errors'
import { NextRequest, NextResponse } from 'next/server'

export type User = {
  id: number
  username: string
  email: string | null
  premium: boolean
  coins: number
}

type Params = Promise<Record<string, string>>

interface WithUserHandler {
  ({ user, req, params }: { user: User; req: NextRequest; params: Params }): Promise<NextResponse>
}

export function withUser(handler: WithUserHandler) {
  return async function (req: NextRequest, props: { params: Params }): Promise<NextResponse> {
    try {
      const session = await verifySession()

      if (!session?.userId) {
        throw new SlatServerError({
          code: 'unauthorized',
          message: 'Unauthorized',
        })
      }

      const result = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, session.userId),
        columns: {
          id: true,
          username: true,
          email: true,
          coins: true,
          lastClaimedAt: true,
        },
      })

      if (!result) {
        throw new SlatServerError({
          code: 'not_found',
          message: 'User not found',
        })
      }

      const user: User = {
        id: result.id,
        username: result.username,
        email: result.email,
        coins: result.coins,
        premium: await isPremium(result.id),
      }

      return await handler({
        user,
        req,
        params: props.params,
      })
    } catch (e) {
      return handleAndReturnErrorResponse(e)
    }
  }
}
