import { Status } from '@/components/biolink/embeds/embed-status'
import { SmallImage, SmallImageSkeleton } from '@/components/biolink/small-image'
import type { Biolink } from '@/lib/data/biolink/schemas'
import type { EmbedStatus } from '@/lib/data/embeds/schemas'
import { cn } from '@/lib/utils'

interface EmbedAvatarProps {
  src?: string
  alt: string
  fallback?: string
  status?: EmbedStatus
  borderRadius: number
  card: Biolink['card']
  container: Biolink['container']
}

export function EmbedAvatar({ src, alt, status, borderRadius, card, container }: EmbedAvatarProps) {
  return (
    <div className="relative size-16 shrink-0">
      {src ? (
        <SmallImage
          container={container}
          card={card}
          src={src}
          alt={alt}
          className="absolute inset-0 h-full"
          borderRadius={borderRadius}
        />
      ) : (
        <SmallImageSkeleton className="absolute inset-0 w-full" borderRadius={borderRadius} />
      )}
      {status && (
        <Status
          className={cn(
            'absolute right-0 bottom-0 translate-x-0.5 translate-y-0.5',
            borderRadius > 10 && 'right-px bottom-px',
          )}
          status={status}
        />
      )}
    </div>
  )
}
