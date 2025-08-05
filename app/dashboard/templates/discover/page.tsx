import type { FilterSearchParams } from '@/lib/data/templates/types'
import { TemplatesPage } from '../_components/templates-page'

export default async function DiscoverTemplatesPage(props: { searchParams: Promise<FilterSearchParams> }) {
  const filters = await props.searchParams

  const initialFilters = {
    page: 1,
    sortBy: 'newest',
    public: true,
    ...filters,
  } satisfies FilterSearchParams

  return <TemplatesPage filters={initialFilters} />
}
