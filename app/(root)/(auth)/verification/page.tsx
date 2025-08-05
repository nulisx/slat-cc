'use client'

import { Loader } from '@/components/ui/loader'
import { Icons } from '@/lib/constants/icons'
import { paths } from '@/lib/constants/paths'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'
import { TurnstileWidget } from '../_components/turnstile-widget'

export default function Verification() {
  const searchParams = useSearchParams()

  const [redirecting, setRedirecting] = React.useState(false)

  const onVerify = async () => {
    setRedirecting(true)
    const redirectPath = decodeURIComponent(searchParams.get('redirect') ?? paths.auth.login)

    const params = new URLSearchParams(searchParams.toString())
    params.delete('redirect')

    const finalUrl = `${redirectPath}${params.toString() ? `?${params.toString()}` : ''}`

    window.location.href = finalUrl
  }

  const heading = redirecting ? 'Redirecting…' : 'Verifying your request…'

  const description = redirecting
    ? 'Please wait while we redirect you.'
    : "Please hold on while we confirm you're not a robot."

  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <Icons.logo className="text-primary h-10 w-10" />
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-xl font-semibold">{heading}</h1>
        <p className="text-muted-foreground max-w-xs text-sm">{description}</p>
      </div>
      {!redirecting ? <TurnstileWidget onVerify={onVerify} /> : <Loader />}
    </div>
  )
}
