'use client'

import { Card } from '@/components/biolink/card'
import { Container } from '@/components/biolink/container'
import { LinkIcon } from '@/components/biolink/link-icon'
import { Tooltip } from '@/components/ui/tooltip'
import { Icons } from '@/lib/constants/icons'
import type { Biolink } from '@/lib/data/biolink/schemas'
import type { Link } from '@/lib/data/links/schemas'
import { generateTarget, isCopyable } from '@/lib/data/links/utils'
import { useRedirect } from '@/lib/hooks/use-redirect'
import { cn } from '@/lib/utils'
import { ofetch } from 'ofetch'

export function SocialLink({ item, biolink }: { item: Link; biolink: Biolink }) {
  const target = generateTarget(item)
  const copyable = isCopyable(target)
  const glow = biolink.enhancements.iconsGlow

  const { redirect } = useRedirect()

  const trackClick = async (targetId: number) => {
    try {
      await ofetch(`/api/analytics/leads/track-click`, {
        method: 'POST',
        body: {
          targetId,
        },
      })
    } catch (error) {
      console.error('Failed to track click:', error)
    }
  }

  const trackAndRedirect = async (item: Link) => {
    redirect(target)

    await trackClick(item.id)
  }

  if (item.style === 'icon') {
    return (
      <Tooltip onClick={() => trackAndRedirect(item)} content={item.label} copyable={copyable} role="button">
        <LinkIcon
          glow={glow}
          color={item.iconColor ?? biolink.themeColor}
          iconName={item.iconName}
          backgroundColor={item.backgroundColor}
          image={item.image}
          size={40}
        />
      </Tooltip>
    )
  }

  return (
    <Card
      onClick={() => trackAndRedirect(item)}
      card={biolink.card}
      role="button"
      className="group relative flex h-fit w-full items-center justify-start gap-x-2 border-[1.5px] p-2.5 duration-300 hover:opacity-80"
    >
      <Container
        className="grid size-16 shrink-0 place-content-center p-0"
        borderRadius={biolink.card.borderRadius}
        container={biolink.container}
      >
        <LinkIcon
          glow={glow}
          color={item.iconColor ?? biolink.themeColor}
          iconName={item.iconName}
          backgroundColor={item.backgroundColor}
          image={item.image}
          size={35}
        />
      </Container>
      <div
        className={cn(
          'line-clamp-1 w-full truncate pl-1 text-left',
          !biolink.layout.alignLeft && 'absolute top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2',
        )}
      >
        <div
          className="font-semibold"
          style={{
            color: biolink.textColor,
          }}
        >
          {item.label}
        </div>
      </div>
      <Icons.arrowRightLong
        className="absolute top-1/2 right-4 mr-3 size-5 shrink-0 -translate-y-1/2 duration-300 group-hover:translate-x-1"
        style={{
          color: biolink.themeColor,
          filter: glow ? `drop-shadow(0 0 3.5px ${biolink.themeColor})` : undefined,
        }}
      />
    </Card>
  )
}
