'use client'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import * as React from 'react'

import { WEBSITE } from '@/lib/config'

export function ClaimYourLink({ className }: { className?: string }) {
  const [username, setUsername] = React.useState('')

  return (
    <div
      className={cn(
        'bg-input/30 border-input relative flex items-center rounded-3xl border p-2 pl-4 backdrop-blur-md',
        className,
      )}
    >
      <span className="text-primary font-mono">{WEBSITE.domain}/</span>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        className="placeholder:text-muted-foreground text-foreground w-32"
      />
      <Link
        href={{ pathname: '/register', query: { username } }}
        className={cn(buttonVariants({ variant: 'primary-glossy' }), 'rounded-full')}
      >
        Claim
      </Link>
    </div>
  )
}
