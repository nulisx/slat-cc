import * as React from 'react'

import { Pagination } from '@/components/pagination'
import { SearchInput } from '@/components/search-input'
import { Skeleton } from '@/components/ui/skeleton'
import { getFilteredTemplates, getMaxPages } from '@/lib/data/templates/actions'
import type { FilterSearchParams } from '@/lib/data/templates/types'
import { getCurrentUser, isPremium } from '@/lib/data/users/actions'
import { TemplateCard } from './template-card'
import { TemplateCreate } from './template-create'
import { TemplatesFilter } from './templates-filter'

export function TemplatesPage({ filters }: { filters: FilterSearchParams }) {
  return (
    <div className="space-y-8">
      <SearchInput placeholder="Search templates..." value={filters.q} />
      <React.Suspense fallback={<LoadingTemplatesContent />}>
        <TemplatesContent filters={filters} />
      </React.Suspense>
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Skeleton className="h-8 w-24" />
          </div>
        }
      >
        <AsyncPagination filters={filters} />
      </React.Suspense>
    </div>
  )
}

async function TemplatesContent({ filters }: { filters: FilterSearchParams }) {
  const [templates, premium, user] = await Promise.all([getFilteredTemplates(filters), isPremium(), getCurrentUser()])

  if (!user) return

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TemplatesFilter filters={filters} />
        {filters.tab === 'owned' && <TemplateCreate isPremium={premium} />}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} filters={filters} isPremium={premium} user={user} />
        ))}
      </div>
    </div>
  )
}

async function AsyncPagination({ filters }: { filters: FilterSearchParams }) {
  const maxPages = await getMaxPages(filters)
  const pageNumber = Number(filters.page)
  return <Pagination page={pageNumber} maxPages={maxPages} />
}

function LoadingTemplatesContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {new Array(12).fill(null).map((_, index) => (
          <Skeleton key={index} className="h-[240px]" />
        ))}
      </div>
    </div>
  )
}
