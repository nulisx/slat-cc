'use server'

import { getConnectedDiscordAccount } from '@/lib/auth/discord/actions/get-connected-discord-oauth'
import { paths } from '@/lib/constants/paths'
import { SlatServerError } from '@/lib/errors'
import { withSession } from '@/lib/middleware/session'
import { db, schema } from '@slat/db'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export const disconnectDiscordAccount = withSession(async (userId: number) => {
  const connectedDiscordAccount = await getConnectedDiscordAccount({ userId })

  if (!connectedDiscordAccount) {
    throw new SlatServerError({
      code: 'not_found',
      message: 'No connected Discord account found for this user',
    })
  }

  await db.delete(schema.oauth2).where(eq(schema.oauth2.userId, connectedDiscordAccount.userId))

  revalidatePath(paths.dashboard.settings.account)
})
