import { getUserId, verifySession } from '@/lib/auth/session'
import { paths } from '@/lib/constants/paths'
import { getCacheKey } from '@/lib/data/utils'
import { toServerActionError } from '@/lib/errors'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface ServerActionResponse<T> {
  data?: T
  error?: string
}

export function withSession<T, R>(handler: (userId: number, data: T) => Promise<ServerActionResponse<R> | void>) {
  return async (data: T): Promise<ServerActionResponse<R> | void> => {
    try {
      const session = await verifySession()

      if (!session) {
        redirect(paths.auth.login)
      }

      return await handler(session.userId, data)
    } catch (error) {
      return toServerActionError<R>(error)
    } finally {
      const userId = await getUserId()
      if (userId) revalidatePath(getCacheKey({ userId }))
    }
  }
}
