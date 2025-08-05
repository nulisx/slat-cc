import { PASSWORD_RESET_TTL_MINUTES } from '@/lib/auth/password-reset/constants'
import { WEBSITE } from '@/lib/config'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import * as React from 'react'
import type { SlatEmailProps } from './render-email-html'

export const SlatResetPasswordEmail: React.FC<SlatEmailProps> = ({ username, token }) => {
  return (
    <Html>
      <Head />
      <Preview>You have requested to reset your password. Click the button below to reset your password.</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              spacing: {
                0: '0px',
                20: '20px',
                45: '45px',
              },
            },
          },
        }}
      >
        <Body className="font-sans text-base text-black">
          <Container className="bg-white p-45 text-black">
            <Img
              src="https://bucket.mailersendapp.com/z3m5jgr8emldpyo6/pr9084z85dx4w63d/images/9de14269-ac2e-408b-8c4e-ebaa42b49126.png"
              width="250"
              height="250"
              alt="slat"
              className="mx-auto my-20 h-[160px] w-[140px] object-cover"
            />
            <Heading className="my-0 text-center leading-8">Reset Password</Heading>
            <Text className="text-center text-base">
              Hi <strong>{username}</strong>, we received a request to reset your password. Click the button below to
              reset your password. It expires in {PASSWORD_RESET_TTL_MINUTES} minutes.
            </Text>
            <Section className="w-full text-center">
              <Button
                href={`${WEBSITE.baseUrl}/reset-password?token=${token}`}
                className="bg-black px-[18px] py-3 text-white"
              >
                Reset Password
              </Button>
            </Section>
          </Container>
          <Container>
            <Text className="mx-auto mb-45 w-full text-center text-xs text-gray-400">
              If you didn&apos;t request a password reset, you can ignore this email. Need help?{' '}
              <Link href={WEBSITE.links.discord} className="text-blue-500 underline">
                Contact us
              </Link>
              ,
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
