import { parseRequestBody } from '@/lib/api/utils'
import { deletePasswordResetByUserId, getPasswordReset } from '@/lib/auth/password-reset/actions'
import { hashPassword } from '@/lib/bcrypt'
import { selectUser, updateUser } from '@/lib/data/users/actions'
import { handleAndReturnErrorResponse, SlatServerError } from '@/lib/errors'
import { resetPasswordChangeFormSchema, ResetPasswordChangeFormValues } from '@/lib/zod/schemas/auth'
import { isBefore } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

/** POST /api/auth/reset-password/change - Change user password after reset */
export async function POST(req: NextRequest) {
  try {
    const data: ResetPasswordChangeFormValues = await parseRequestBody(req)

    const { token, newPassword } = resetPasswordChangeFormSchema.parse(data)

    const existingPasswordReset = await getPasswordReset({ token })

    if (!existingPasswordReset) {
      throw new SlatServerError({
        code: 'not_found',
        message: 'Invalid token',
      })
    }

    if (isBefore(existingPasswordReset.expiresAt, new Date())) {
      throw new SlatServerError({
        code: 'bad_request',
        message: 'Token expired',
      })
    }
    const user = await selectUser({ where: { id: existingPasswordReset.userId }, select: ['id'] })

    if (!user) {
      throw new SlatServerError({
        code: 'not_found',
        message: 'User not found',
      })
    }

    await Promise.all([
      updateUser(user.id, { password: hashPassword(newPassword) }),
      deletePasswordResetByUserId(user.id),
    ])

    return NextResponse.json({ message: 'Password updated successfully.' })
  } catch (e) {
    return handleAndReturnErrorResponse(e)
  }
}
