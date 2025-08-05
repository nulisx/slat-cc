'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/lib/constants/icons'
import { paths } from '@/lib/constants/paths'
import { useApiRoutes } from '@/lib/hooks/use-api-routes'
import {
  resetPasswordChangeFormSchema,
  resetPasswordRequestFormSchema,
  type ResetPasswordChangeFormValues,
  type ResetPasswordRequestFormValues,
} from '@/lib/zod/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AuthFormWrapper, AuthHeader } from '../../_components/auth-form-wrapper'

export interface ResetPasswordProps {
  proceed: () => void
  token?: string
}

export function ResetPasswordRequestForm({ proceed }: ResetPasswordProps) {
  const form = useForm<ResetPasswordRequestFormValues>({
    resolver: zodResolver(resetPasswordRequestFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const { actions, loading } = useApiRoutes([
    {
      name: 'request',
      endpoint: '/api/auth/reset-password/request-email',
      method: 'POST',
    },
  ] as const)

  const handleSubmit = async (values: ResetPasswordRequestFormValues) => {
    try {
      await actions.request(values)

      proceed()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An unknown error occurred.')
    }
  }

  return (
    <AuthFormWrapper title="Reset Password" description="Enter your email address to receive a password reset link.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    icon={Icons.at}
                    placeholder="Your email address"
                    autoComplete="false"
                    type="email"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} variant="primary-glossy" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  )
}

export function ResetPasswordEmailSent() {
  return <AuthHeader title="Email Sent!" description="Please check your email to continue the process." />
}

export function ResetPasswordChangeForm({ proceed, token }: ResetPasswordProps) {
  if (!token) redirect('/reset-password')

  const form = useForm<ResetPasswordChangeFormValues>({
    resolver: zodResolver(resetPasswordChangeFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      token,
    },
  })

  const { actions, loading } = useApiRoutes([
    {
      name: 'change',
      endpoint: '/api/auth/reset-password/change',
      method: 'POST',
    },
  ])

  const onSubmit = async (values: ResetPasswordChangeFormValues) => {
    try {
      await actions.change(values)

      proceed()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An unknown error occurred.')
    }
  }

  return (
    <>
      <AuthHeader title="Password Change" description="Enter your new password to reset your account password." />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter new password"
                    autoComplete="false"
                    type="password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="re-enter new password"
                    autoComplete="false"
                    type="password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} variant="primary-glossy" type="submit" className="w-full">
            Change Password
          </Button>
        </form>
      </Form>
    </>
  )
}

export function ResetPasswordSuccess() {
  return (
    <>
      <AuthHeader title="Password Succesfully Changed!" description="You can now login with your new password." />
      <Link href={paths.auth.login} passHref>
        <Button variant="primary-glossy" className="w-full">
          Login
        </Button>
      </Link>
    </>
  )
}
