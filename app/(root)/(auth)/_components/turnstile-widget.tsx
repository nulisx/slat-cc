import { ofetch } from 'ofetch'

import { Turnstile as NextTurnstile } from 'next-turnstile'
import { isDevelopment } from '@/lib/utils'
import * as React from 'react'

export function TurnstileWidget({ onVerify }: { onVerify: () => void }) {
  const verifyToken = async (token: string) => {
    await ofetch('/api/auth/challenge/verify', {
      method: 'POST',
      query: { token },
    })

    onVerify()
  }

  return (
    <NextTurnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      retry="auto"
      refreshExpired="auto"
      sandbox={isDevelopment()}
      theme="dark"
      onError={() => {}}
      onExpire={() => {}}
      onLoad={() => {}}
      onVerify={async (token) => await verifyToken(token)}
    />
  )
}
