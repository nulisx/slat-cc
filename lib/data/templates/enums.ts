import * as z from 'zod'

export const typeSchema = z.enum(['all', 'free', 'premium'])

export type FilterType = z.infer<typeof typeSchema>

export const sortBySchema = z.enum(['popular', 'newest', 'oldest'])

export type FilterSortBy = z.infer<typeof sortBySchema>

export const tabSchema = z.enum(['discover', 'owned', 'favorited'])

export type FilterTab = z.infer<typeof tabSchema>
