import { BiolinkPreview } from '@/components/biolink/preview/biolink-preview'
import { BiolinkPreviewInitializer } from '@/components/biolink/preview/biolink-preview-initializer'
import { PageLayout } from '@/components/layout/page-layout'
import { getBadges } from '@/lib/data/badges/actions'
import { getBiolink } from '@/lib/data/biolink/actions/get-biolink'
import { getEmbeds } from '@/lib/data/embeds/actions'
import { getLinks } from '@/lib/data/links/actions'
import { isPremium } from '@/lib/data/users/actions'
import { AssetsForm } from './_components/assets-form'
import { CardForm } from './_components/card-form'
import { ColorsForm } from './_components/colors-form'
import { EnhancementsForm } from './_components/enhancements-form'
import { FontForm } from './_components/font-form'
import { LayoutForm } from './_components/layout-form'
import { PremiumUpgradeCard } from './_components/premium-upgrade-card'
import { ProfileForm } from './_components/profile-form'
import { RevealScreenForm } from './_components/reveal-screen-form'

type Profile = Awaited<ReturnType<typeof getProfile>>

async function getProfile() {
  const [biolink, premium, links, embeds, badges] = await Promise.all([
    getBiolink(),
    isPremium(),
    getLinks(),
    getEmbeds(),
    getBadges(),
  ])

  if (!biolink) return null

  return { biolink, premium, links, embeds, badges }
}

export default async function Page() {
  const profile = await getProfile()

  if (!profile) return null

  const { biolink, premium } = profile

  return (
    <BiolinkPreviewWrapper profile={profile}>
      <div className="mx-auto space-y-6">
        <AssetsForm biolink={biolink} premium={premium} />
        <ProfileForm biolink={biolink} premium={premium} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ColorsForm biolink={biolink} />
          <FontForm biolink={biolink} premium={premium} />
        </div>
        <LayoutForm biolink={biolink} />
        <CardForm biolink={biolink} />
        {!premium && <PremiumUpgradeCard />}
        <EnhancementsForm biolink={biolink} premium={premium} />
        {premium && <RevealScreenForm biolink={biolink} />}
      </div>
    </BiolinkPreviewWrapper>
  )
}

async function BiolinkPreviewWrapper({ children, profile }: { children: React.ReactNode; profile: Profile }) {
  if (!profile) return null
  return (
    <>
      <BiolinkPreviewInitializer biolink={profile.biolink} />
      <div className="flex">
        <PageLayout className="max-w-4xl">{children}</PageLayout>
        <BiolinkPreview badges={profile.badges} links={profile.links} embeds={profile.embeds} />
      </div>
    </>
  )
}
