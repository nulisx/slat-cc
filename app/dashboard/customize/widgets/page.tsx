import WidgetsClient from '@/app/dashboard/customize/widgets/client'
import { getBiolink } from '@/lib/data/biolink/actions/get-biolink'
import { getEmbeds } from '@/lib/data/embeds/actions'
import { EmbedOptions } from './_components/embed-options'

export default async function WidgetsPage() {
  const [biolink, embeds] = await Promise.all([getBiolink(), getEmbeds()])

  if (!biolink) return null

  return (
    <>
      <EmbedOptions />
      <WidgetsClient biolink={biolink} embeds={embeds} />
    </>
  )
}
