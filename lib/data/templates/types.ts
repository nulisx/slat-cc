import type { FilterSortBy, FilterTab, FilterType } from '@/lib/data/templates/enums'

export interface FilterSearchParams {
  q?: string
  sortBy?: FilterSortBy
  type?: FilterType
  tags?: string
  public?: boolean
  tab?: FilterTab
  limit?: number
  offset?: number
  page?: number
}
