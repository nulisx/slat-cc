import { match } from 'ts-pattern'

import type { EmbedStatus } from '@/lib/data/embeds/schemas'
import { cn } from '@/lib/utils'

function getColor(status: EmbedStatus) {
  return match(status)
    .with('gray', () => 'bg-neutral-300')
    .with('green', () => 'bg-green-500')
    .with('yellow', () => 'bg-amber-500')
    .with('red', () => 'bg-red-600')
    .with('purple', () => 'bg-purple-700')
    .otherwise(() => '')
}

export function Status({ status, className }: { className?: string; status: EmbedStatus }) {
  const color = getColor(status)

  function animatePing(status: EmbedStatus): boolean {
    const animateStatuses: EmbedStatus[] = ['green', 'purple']
    return animateStatuses.includes(status)
  }

  return (
    <div className={cn(className)}>
      <span className="relative flex size-2.5">
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75',
            color,
            animatePing(status) && 'animate-ping',
          )}
        />
        <span className={cn('relative inline-flex size-2.5 rounded-full', color)} />
      </span>
    </div>
  )
}
