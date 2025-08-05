import { AudioSource } from '@/components/biolink/audio-source'
import { BiolinkPageProvider } from '@/components/biolink/biolink-page-provider'
import { BiolinkPageWrapper } from '@/components/biolink/biolink-page-wrapper'
import { Comment } from '@/components/biolink/comments/comment'
import { CommentListCompact } from '@/components/biolink/comments/comment-list-compact'
import { CursorTrail } from '@/components/biolink/cursor-trails/cursor-trail'
import { Embed } from '@/components/biolink/embeds/embed'
import { SocialLink } from '@/components/biolink/link'
import { Overlay } from '@/components/biolink/overlay'
import { PageTransition } from '@/components/biolink/page-transition'
import { ProfileCard } from '@/components/biolink/profile-card'
import { MusicPlayer } from '@/components/biolink/tracks/track-music-player'
import { Views } from '@/components/biolink/views'
import { getUserId } from '@/lib/auth/session'
import { ONE_HOUR_IN_SECONDS } from '@/lib/constants/revalidates'
import { getViewsCount } from '@/lib/data/actions/get-views-count'
import { getBadges } from '@/lib/data/badges/actions'
import { getBiolink } from '@/lib/data/biolink/actions/get-biolink'
import type { Biolink } from '@/lib/data/biolink/schemas'
import { getComments } from '@/lib/data/comments/actions'
import { getEmbeds } from '@/lib/data/embeds/actions'
import { getLinks } from '@/lib/data/links/actions'
import { getTracks } from '@/lib/data/tracks/actions'
import { getUserIdByUsername } from '@/lib/data/users/actions'
import { getCacheKey } from '@/lib/data/utils'
import { Metadata, Viewport } from 'next'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { generateBiolinkMetadata } from './_actions/metadata'
import { generateViewportMetadata } from './_actions/viewport'
import { ClientViewTracker } from './_components/client-view-tracker'
import { TemplatePreviewBanner } from './_components/template-preview-banner'

interface Params {
  username: string
}

interface SearchParams {
  templateId?: string
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata | undefined> {
  const { username } = await props.params

  return await generateBiolinkMetadata(username)
}

export async function generateViewport(props: { params: Promise<Params> }): Promise<Viewport> {
  const { username } = await props.params

  return await generateViewportMetadata(username)
}

export default async function ProfilePage(props: { params: Promise<Params>; searchParams: Promise<SearchParams> }) {
  const { username } = await props.params
  const { templateId: rawTemplateId } = await props.searchParams

  const templateId = rawTemplateId ? parseInt(rawTemplateId) : undefined
  const userId = await getUserIdByUsername(username)

  if (!userId) {
    notFound()
  }

  const getCachedProfile = unstable_cache(
    async (userId: number, templateId?: number) => {
      const [biolink, embeds, tracks, badges, links] = await Promise.all([
        getBiolink(userId, templateId),
        getEmbeds(userId),
        getTracks(userId),
        getBadges(userId),
        getLinks(userId),
      ])

      return {
        biolink,
        embeds,
        tracks,
        badges,
        links,
      }
    },
    [getCacheKey({ userId, templateId })],
    { revalidate: ONE_HOUR_IN_SECONDS }, // TODO: revalidate all needed
  )

  const profile = await getCachedProfile(userId, templateId)

  if (!profile.biolink) {
    notFound()
  }

  const biolink = profile.biolink
  const { enhancements, assets, revealScreen, comments, themeColor } = profile.biolink
  const showRevealScreen = !!assets.video || !!assets.audio || revealScreen.persistent
  const visitorId = comments.hidden ? undefined : await getUserId()
  const audioSource = assets.audio || assets.background

  const outsideProfileCardLinks = profile.links.filter((link) => link.style === 'card' && !link.hidden)
  const outsideProfileCardEmbeds = profile.embeds.filter((embed) => !embed.insideProfileCard)

  return (
    <BiolinkPageProvider biolink={biolink} className="relative min-h-svh w-full overflow-x-hidden">
      <Overlay showRevealScreen={showRevealScreen} authenticated={!!visitorId} biolink={biolink} />
      {audioSource && <AudioSource source={audioSource} biolink={biolink} />}
      <BiolinkPageWrapper biolink={biolink}>
        {enhancements.cursorTrail && (
          <CursorTrail
            color={themeColor}
            trail={enhancements.cursorTrail}
            className="pointer-events-none fixed inset-0 z-99 h-full w-full"
          />
        )}
        {templateId && <TemplatePreviewBanner templateId={templateId} />}
        <ClientViewTracker userId={userId} />
        <PageTransition
          suspense={showRevealScreen}
          transition={enhancements.pageTransition}
          duration={enhancements.pageTransitionDuration}
        >
          <ProfileCard
            biolink={biolink}
            badges={profile.badges}
            links={profile.links}
            views={<SuspenseViews biolink={biolink} />}
            embeds={profile.embeds}
          />
          <>
            {outsideProfileCardLinks.map((item) => (
              <SocialLink key={item.id} item={item} biolink={biolink} />
            ))}
            {profile.tracks.length > 0 && (
              <MusicPlayer
                tracks={profile.tracks}
                colors={{
                  text: biolink.textColor,
                  theme: biolink.themeColor,
                  name: biolink.nameColor,
                }}
                card={biolink.card}
                layout={biolink.layout.musicPlayer}
              />
            )}
            {outsideProfileCardEmbeds.map((embed) => (
              <Embed
                key={embed.id}
                embed={embed}
                card={biolink.card}
                container={biolink.container}
                colors={{
                  text: biolink.textColor,
                  theme: biolink.themeColor,
                  name: biolink.nameColor,
                }}
              />
            ))}
            {!comments.hidden && <SuspenseComments userId={userId} biolink={biolink} visitorId={visitorId} />}
          </>
        </PageTransition>
      </BiolinkPageWrapper>
    </BiolinkPageProvider>
  )
}

async function SuspenseViews({ biolink }: { biolink: Biolink }) {
  const views = await getViewsCount({ biolinkId: biolink.id })

  return <Views views={views} biolink={biolink} />
}

async function SuspenseComments({
  userId,
  biolink,
  visitorId,
}: {
  userId: number
  biolink: Biolink
  visitorId?: number
}) {
  const comments = await getComments(userId)

  if (comments.length === 0) return null

  return (
    <>
      {biolink.comments.compact ? (
        <CommentListCompact comments={comments} biolink={biolink} visitorId={visitorId} />
      ) : (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} biolink={biolink} visitorId={visitorId} />
        ))
      )}
    </>
  )
}
