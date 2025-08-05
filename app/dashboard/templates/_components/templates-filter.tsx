'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TagsInput } from '@/components/ui/tags-input'
import type { FilterSortBy, FilterType } from '@/lib/data/templates/enums'
import { sortBySchema, typeSchema } from '@/lib/data/templates/enums'
import type { FilterSearchParams } from '@/lib/data/templates/types'
import { parseTags } from '@/lib/data/templates/utils'
import { useSearchParams } from '@/lib/hooks/use-search-params'
import { FieldOptions } from '@/lib/types'
import { capitalizeEachWord } from '@/lib/utils'
import * as React from 'react'
import { BiSortAlt2 } from 'react-icons/bi'
import { RiFilter3Fill } from 'react-icons/ri'

const typeOptions = typeSchema.options.map((value) => ({
  value,
  label: capitalizeEachWord(value),
})) satisfies FieldOptions<FilterType>

const sortByOptions = sortBySchema.options.map((value) => ({
  value,
  label: capitalizeEachWord(value),
})) satisfies FieldOptions<FilterSortBy>

export function TemplatesFilter({ filters: initialFilters }: { filters: FilterSearchParams }) {
  const searchParams = useSearchParams()

  const [filters, setFilters] = React.useState<{
    type: FilterType
    sortBy: FilterSortBy
    tags: string[]
  }>({
    type: initialFilters.type || 'all',
    sortBy: initialFilters.sortBy || 'popular',
    tags: initialFilters.tags ? parseTags(initialFilters.tags) : [],
  })

  const updateSearchParams = (params: Partial<FilterSearchParams>) => {
    const updatedParams: FilterSearchParams = {
      ...initialFilters,
      ...params,
    }

    searchParams.update({
      q: updatedParams.q,
      sortBy: updatedParams.sortBy,
      type: updatedParams.type,
      tags: updatedParams.tags,
      public: updatedParams.public ? 'true' : undefined,
      limit: updatedParams.limit?.toString(),
      offset: updatedParams.offset?.toString(),
      page: updatedParams.page?.toString(),
    })
  }

  return (
    <div className="flex flex-row justify-end gap-x-3 sm:items-center">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 text-sm font-medium">
            Filter
            <RiFilter3Fill className="text-muted-foreground h-5 w-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <div className="border-b p-3">
            <h3 className="text-sm font-medium">Filters</h3>
          </div>
          <div className="space-y-3 p-3">
            <div className="space-y-1">
              <h4 className="text-muted-foreground text-xs font-medium">Tags</h4>
              <TagsInput
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, tags: value }))
                  updateSearchParams({ tags: value.join(','), page: 1 })
                }}
                value={filters.tags}
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-muted-foreground text-xs font-medium">Filter by</h4>
              <Select
                value={filters.type}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, type: value as FilterType }))
                  updateSearchParams({ type: value as FilterType, page: 1 })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Type</SelectLabel>
                    {typeOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center border-t p-3">
            <button
              className="text-muted-foreground hover:text-foreground text-xs underline focus:outline-none"
              onClick={() => searchParams.clear()}
            >
              Clear filters
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <Select
        value={filters.sortBy}
        onValueChange={(value) => {
          setFilters((prev) => ({ ...prev, sortBy: value as FilterSortBy }))
          updateSearchParams({
            sortBy: value as FilterSortBy,
            page: 1,
          })
        }}
      >
        <SelectTrigger unstyled className="flex w-fit items-center gap-2 text-sm font-medium">
          Sort by
          <BiSortAlt2 className="text-muted-foreground h-5 w-5" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            {sortByOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
