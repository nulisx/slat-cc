'use client'

import { BiolinkSkeleton } from '@/components/biolink/biolink-skeleton'
import { Card } from '@/components/biolink/card'
import { getEmbedCard, type EmbedProps } from '@/components/biolink/embeds/embed'
import { EmbedAvatar } from '@/components/biolink/embeds/embed-avatar'
import {
  EmbedAboutList,
  EmbedIdentifier,
  EmbedStatsList,
  EmbedTitle,
} from '@/components/biolink/embeds/embed-typography'
import { Icons } from '@/lib/constants/icons'
import { paths } from '@/lib/constants/paths'
import type { GithubProfile } from '@/lib/data/embeds/github/schemas'
import { generateReadmeStatsUrl } from '@/lib/data/embeds/github/utils'
import { cn, formatTimeDifference } from '@/lib/utils'
import Image from 'next/image'
import { ofetch } from 'ofetch'
import { SiGithub } from 'react-icons/si'
import useSWR from 'swr'

export function GitHubProfile({ embed, card, container, colors }: EmbedProps) {
  const apiPath = `${paths.api.integrations.github}/${embed.identifier}`
  const { data, error: _, isLoading: loading } = useSWR(apiPath, async () => await ofetch<GithubProfile>(apiPath))

  const embedCard = getEmbedCard({ isInsideProfileCard: embed.insideProfileCard, card, container })

  return (
    <Card card={embedCard} className="relative flex w-full flex-col overflow-hidden p-0" style={{ color: colors.text }}>
      <div className="flex gap-x-3 p-2.5">
        <EmbedAvatar
          card={embedCard}
          container={container}
          src={data?.avatarUrl}
          borderRadius={card.borderRadius}
          alt={`${data?.username} Avatar`}
        />
        <div className="flex flex-col">
          <EmbedTitle
            href={`https://github.com/${embed.identifier}`}
            title={data?.name}
            color={colors.name}
            loading={loading}
          />
          {data && (
            <>
              <EmbedIdentifier identifier={data.username} icon={SiGithub} />
              <EmbedStatsList
                items={[
                  { value: data.followers, label: 'Followers' },
                  { value: data.following, label: 'Following' },
                  { value: data.publicRepos, label: 'Repos' },
                ]}
              />
            </>
          )}
        </div>
      </div>
      {!embed.compactLayout && (
        <div className={cn((!embed.secondStyle || loading) && 'px-2 pb-2')}>
          {data ? (
            <>
              {embed.secondStyle ? (
                <div className="flex flex-wrap">
                  <picture>
                    <img
                      src={generateReadmeStatsUrl('overview', {
                        username: data.username,
                        textColor: colors.text,
                        titleColor: colors.name,
                      })}
                      alt={`${data.username} GitHub Stats`}
                    />
                  </picture>
                  <picture>
                    <img
                      src={generateReadmeStatsUrl('top-langs', {
                        username: data.username,
                        textColor: colors.text,
                        titleColor: colors.name,
                      })}
                      alt={`${data.username} GitHub Top Languages`}
                    />
                  </picture>
                </div>
              ) : (
                <>
                  <EmbedAboutList
                    text={data.bio}
                    items={[
                      { value: data.location, icon: Icons.location },
                      {
                        value: data.company,
                        icon: Icons.building,
                        href: `https://github.com/${data.company?.replace('@', '')}`,
                      },
                      { value: data.blog, icon: Icons.link, href: data.blog },
                      { value: `Joined ${formatTimeDifference(new Date(data.createdAt))}`, icon: Icons.clock },
                    ]}
                  />
                  <div className="w-full overflow-x-auto rounded">
                    <Image
                      src={`https://ghchart.rshah.org/239a3b/${data.username}`}
                      alt={`${data.username} GitHub Contribution Chart`}
                      width={800}
                      height={150}
                      className="h-auto w-full max-w-none"
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <BiolinkSkeleton className="h-2.5 w-12" />
              {new Array(2).fill(null).map((_, idx) => (
                <BiolinkSkeleton key={idx} className="w/3 h-3" />
              ))}
              <BiolinkSkeleton className="h-24 w-full" />
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
