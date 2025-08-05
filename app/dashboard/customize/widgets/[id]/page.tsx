import { EmbedForm } from '../_components/embed-form'
import { TabsNavigation, type TabOptions } from '@/components/layout/nav-tabs'
import { normalizeText } from '@/lib/utils'
import { getEmbedById } from '@/lib/data/embeds/actions'
import { getEmbedTypeByContent, getEmbedPlatformByType } from '@/lib/data/embeds/constants'
import { DocumentationHelp } from '@/components/documentation-help'
import { getBiolink } from '@/lib/data/biolink/actions/get-biolink'
import { EmbedType } from '@/lib/data/embeds/utils'

export default async function WidgetPage(props: {
  searchParams: Promise<{
    type?: EmbedType
  }>
  params: Promise<{ id?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const id = params.id ? parseInt(params.id) : undefined

  const [embed, biolink] = await Promise.all([id ? getEmbedById(id) : Promise.resolve(undefined), getBiolink()])

  if (!biolink) return null

  const embedType = searchParams.type ?? getEmbedTypeByContent(embed?.content)
  const parentPlatform = getEmbedPlatformByType(embedType)

  return (
    <>
      {!embed && (
        <TabsNavigation
          value={embedType}
          options={
            parentPlatform.options.map((option) => ({
              label: normalizeText(option.type),
              value: option.type,
              searchParams: { type: option.type },
            })) satisfies TabOptions<string>
          }
        />
      )}
      <EmbedForm biolink={biolink} data={embed} embedType={embedType} />
      <DocumentationHelp href="/docs/widgets">Widgets Guide</DocumentationHelp>
    </>
  )
}
