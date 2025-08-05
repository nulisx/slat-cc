'use server'

import { decrypt, encrypt } from '@/lib/jwt'
import { addDays } from 'date-fns'
import { cookies } from 'next/headers'
import * as z from 'zod'

/*
 * https://nextjs.org/docs/app/guides/authentication#session-management
 */

type SessionPayload = {
  userId: number
  expiresAt: Date
}

const SESSION_COOKIE_NAME = 'session'

type CreateSessionArgs = {
  userId: number
  rememberMe: boolean
}

export async function createSession(args: CreateSessionArgs) {
  const expiresAt = addDays(new Date(), args.rememberMe ? 7 : 1)

  const payload: SessionPayload = {
    userId: args.userId,
    expiresAt,
  }

  const session = await encrypt(payload)
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

const decryptedSessionSchema = z.object({
  userId: z.number(),
  expiresAt: z.string(),
  iat: z.number(),
  exp: z.number(),
})

const sessionSchema = z.object({
  userId: z.number(),
})

export const verifySession = async (): Promise<z.infer<typeof sessionSchema> | undefined> => {
  const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  const decoded = await decrypt(cookie)

  if (!decoded) return

  const parsed = decryptedSessionSchema.safeParse(decoded)

  if (parsed.success) {
    return { userId: parsed.data.userId }
  }

  return undefined
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getUserId(): Promise<number | undefined> {
  const session = await verifySession()
  return session?.userId
}

/**
 * Wraps a function that requires a userId and returns the given fallback if userId cannot be resolved.
 */
export async function withUserId<T>(
  fn: (userId: number) => Promise<T>,
  args: { userId?: number; fallback: () => T },
): Promise<T> {
  try {
    const resolvedUserId = args.userId ?? (await getUserId())
    if (!resolvedUserId) return args.fallback()
    return await fn(resolvedUserId)
  } catch (e) {
    console.error('Error in withUserId:', e)
    return args.fallback()
  }
}
