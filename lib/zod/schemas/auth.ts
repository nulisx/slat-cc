import * as z from 'zod'

import { userFields } from '@/lib/data/users/schemas'

export const loginFormSchema = z.object({
  identifier: z.string().min(1, { message: 'Username or email is required.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

export const resetPasswordStepSchema = z.enum(['request-email', 'email-sent', 'change-password', 'success'])

export type ResetPasswordStep = z.infer<typeof resetPasswordStepSchema>

export const registerFormSchema = z.object({
  email: userFields.email,
  password: userFields.password,
  username: userFields.username,
})

export type RegisterFormValues = z.infer<typeof registerFormSchema>

export const resetPasswordRequestFormSchema = z.object({
  email: userFields.email,
})

export type ResetPasswordRequestFormValues = z.infer<typeof resetPasswordRequestFormSchema>

export const resetPasswordChangeFormSchema = z
  .object({
    newPassword: userFields.password,
    confirmPassword: userFields.password,
    token: z.string(),
  })
  .refine((fields) => fields.newPassword === fields.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  })

export type ResetPasswordChangeFormValues = z.infer<typeof resetPasswordChangeFormSchema>
