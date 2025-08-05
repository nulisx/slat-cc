import { SlatPasswordUpdatedEmail } from '@/components/email/slat-password-changed'
import { SlatResetPasswordEmail } from '@/components/email/slat-reset-password-email'
import { SlatWelcomeEmail } from '@/components/email/slat-welcome-email'
import { render } from '@react-email/components'
import { match } from 'ts-pattern'

export type SlatEmailProps = {
  type: 'reset-password' | 'welcome' | 'password-changed'
  username: string
  token?: string
}

export async function renderEmailHtml({ ...props }: SlatEmailProps) {
  return match(props.type)
    .with('reset-password', () => render(<SlatResetPasswordEmail {...props} />))
    .with('welcome', () => render(<SlatWelcomeEmail />))
    .with('password-changed', () => render(<SlatPasswordUpdatedEmail {...props} />))
    .exhaustive()
}
