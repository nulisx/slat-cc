import { getDiscordPresence } from '@/lib/data/embeds/discord/discord-presence'
import { handleAndReturnErrorResponse } from '@/lib/errors'
import { NextRequest, NextResponse } from 'next/server'

/** GET /api/integrations/discord-presence/[userId] - Fetch Discord presence for a user */
export async function GET(_: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const { userId } = await props.params
  try {
    const discordPresence = await getDiscordPresence(userId)

    return NextResponse.json(discordPresence)
  } catch (error) {
    return handleAndReturnErrorResponse(error)
  }
}
