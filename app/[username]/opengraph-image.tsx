import { OpengraphImage } from '@/components/biolink/opengraph-image'
import { getBiolink } from '@/lib/data/biolink/actions/get-biolink'
import { getMetadata } from '@/lib/data/metadata/actions'
import { getUserIdByUsername, isVerified } from '@/lib/data/users/actions'
import { handleAndReturnErrorResponse, SlatServerError } from '@/lib/errors'
import { ImageResponse } from 'next/og'

export const alt = 'slat cc profile opengraph image'
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  try {
    const userId = await getUserIdByUsername(username)

    if (!userId) {
      throw new SlatServerError({
        code: 'not_found',
        message: 'User not found',
      })
    }

    const [biolink, verified, metadata] = await Promise.all([
      getBiolink(userId),
      isVerified(userId),
      getMetadata(userId),
    ])

    if (!biolink || !metadata) {
      throw new SlatServerError({
        code: 'not_found',
        message: 'Not found',
      })
    }

    return new ImageResponse(<OpengraphImage biolink={biolink} verified={verified} metadata={metadata} />, {
      ...size,
    })
  } catch (e) {
    return handleAndReturnErrorResponse(e)
  }
}
