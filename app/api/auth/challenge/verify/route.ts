import { parse } from '@/lib/api/parse'
import { issueVerificationToken } from '@/lib/auth/turnstile'
import { verifyWithCloudfare } from '@/lib/data/actions/verify-with-cloudfare'
import { handleAndReturnErrorResponse, SlatServerError } from '@/lib/errors'
import { NextRequest, NextResponse } from 'next/server'

/** POST /api/auth/challenge/verify - Verify Turnstile challenge */
export async function POST(req: NextRequest) {
  const { ip, searchParamsObj } = parse(req)
  try {
    const token = searchParamsObj.token

    if (!token) {
      throw new SlatServerError({
        code: 'bad_request',
        message: 'Token is required',
      })
    }

    const result = await verifyWithCloudfare(token, ip)

    if (!result.success) {
      throw new SlatServerError({
        code: 'forbidden',
        message: `Turnstile verification failed: ${result['error-codes']?.join(', ') || 'Unknown error'}`,
      })
    }

    await issueVerificationToken(10)

    return NextResponse.json({ message: 'Verification successful' })
  } catch (e) {
    return handleAndReturnErrorResponse(e)
  }
}
