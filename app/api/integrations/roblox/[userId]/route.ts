import { getRobloxProfile } from '@/lib/data/embeds/roblox/roblox'
import { handleAndReturnErrorResponse } from '@/lib/errors'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 600 // 10 minutes

/** GET /api/integrations/roblox/[userId] - Get Roblox profile */
export async function GET(_: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const { userId } = await props.params
  try {
    const robloxProfile = await getRobloxProfile(userId)

    return NextResponse.json(robloxProfile)
  } catch (error) {
    return handleAndReturnErrorResponse(error)
  }
}
