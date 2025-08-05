import { Avatar } from '@/components/biolink/avatar'
import { BadgeList } from '@/components/biolink/badge-list'
import { Bio } from '@/components/biolink/bio'
import { Card } from '@/components/biolink/card'
import { Details } from '@/components/biolink/details'
import { DisplayName } from '@/components/biolink/display-name'
import { EmbedList } from '@/components/biolink/embed-list'
import { LinkList } from '@/components/biolink/link-list'
import { ProfileCardBanner } from '@/components/biolink/profile-card-banner'
import { Badge } from '@/lib/data/badges/schemas'
import type { Biolink } from '@/lib/data/biolink/schemas'
import { isCardTransparent } from '@/lib/data/biolink/utils/card-utils'
import type { Embed } from '@/lib/data/embeds/schemas'
import { Link } from '@/lib/data/links/schemas'
import { cn } from '@/lib/utils'
import * as React from 'react'
import { match } from 'ts-pattern'

export function ProfileCard({
  biolink,
  badges,
  links,
  views,
  embeds,
}: {
  biolink: Biolink
  links: Link[]
  badges: Badge[]
  views: React.ReactNode
  embeds: Embed[]
}) {
  const { profile, layout, assets, enhancements } = biolink

  const avatarPositionClasses = match({ position: layout.avatarPosition, alignLeft: layout.alignLeft })
    .with({ position: 'float', alignLeft: true }, () => 'absolute bottom-full left-0 translate-y-6 translate-x-0')
    .with({ position: 'float', alignLeft: false }, () => 'absolute bottom-full left-1/2 translate-y-6 -translate-x-1/2')
    .otherwise(() => undefined)

  const insideProfileCardEmbeds = embeds.filter((embed) => embed.insideProfileCard)
  const insideProfileCardLinks = links.filter((link) => link.style === 'icon' && !link.hidden)

  return (
    <Card
      isProfileCard
      card={biolink.card}
      className={cn(
        'relative h-fit w-full',
        assets.banner && 'overflow-hidden', // ensure banner doesn't overflow the card radius
        enhancements.visualizeAudio && 'audio-visualizer-shadow',
      )}
    >
      {enhancements.showViews && views}
      {assets.banner && <ProfileCardBanner biolink={biolink} />}
      <div className={cn('space-y-6 p-6', isCardTransparent(biolink.card) && 'px-0 pb-0')}>
        <div
          className={cn(
            'relative flex w-full flex-col items-center gap-x-4 gap-y-2',
            layout.alignLeft && 'items-start',
            layout.avatarPosition === 'aside' && 'flex-row',
            layout.avatarPosition === 'float' && 'pt-8',
          )}
        >
          <Avatar assets={assets} className={cn(avatarPositionClasses)} />
          <div className="w-full max-w-full">
            <div
              className={cn(
                'relative mx-auto flex w-fit flex-col items-center gap-1',
                layout.alignLeft && 'mx-0 w-fit items-start',
              )}
            >
              <DisplayName
                title={profile.name}
                options={{
                  tooltip: `UID ${biolink.userId}`,
                  effects: enhancements.nameEffects,
                  color: biolink.nameColor,
                  font: biolink.nameFont,
                }}
              />
              <BadgeList badges={badges} biolink={biolink} />
            </div>
            <Bio
              text={profile.bio}
              options={{
                bioEffect: enhancements.bioEffect,
                color: biolink.textColor,
                alignLeft: layout.alignLeft,
              }}
            />
            {(profile.location || profile.occupation) && <Details biolink={biolink} />}
          </div>
        </div>
        <div className="space-y-4">
          {insideProfileCardEmbeds.length > 0 && <EmbedList embeds={insideProfileCardEmbeds} biolink={biolink} />}
          {insideProfileCardLinks.length > 0 && <LinkList links={insideProfileCardLinks} biolink={biolink} />}
        </div>
      </div>
    </Card>
  )
}
