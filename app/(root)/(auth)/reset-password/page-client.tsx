'use client'

import * as React from 'react'

import { resetPasswordStepSchema, type ResetPasswordStep } from '@/lib/zod/schemas/auth'

import {
  ResetPasswordRequestForm,
  ResetPasswordChangeForm,
  ResetPasswordEmailSent,
  ResetPasswordSuccess,
  type ResetPasswordProps,
} from './_components/reset-password-form'

export default function ResetPasswordPageClient({ token }: { token?: string }) {
  const [step, setStep] = React.useState<ResetPasswordStep>(token ? 'change-password' : 'request-email')

  const nextStep = () => {
    const steps = resetPasswordStepSchema.options
    const currentIndex = steps.indexOf(step)

    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const stepComponents: Record<ResetPasswordStep, React.ComponentType<ResetPasswordProps>> = {
    'request-email': ResetPasswordRequestForm,
    'email-sent': ResetPasswordEmailSent,
    'change-password': ResetPasswordChangeForm,
    success: ResetPasswordSuccess,
  }

  const StepComponent = stepComponents[step]

  return <StepComponent proceed={nextStep} token={token} />
}
