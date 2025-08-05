'use server'

import { withSession } from '@/lib/middleware/session'
import { ofetch } from 'ofetch'

const ICONIFY_ENDPOINTS = ['https://api.iconify.design', 'https://api.simplesvg.com', 'https://api.unisvg.com']

export const searchIconifyIcons = withSession(async (_: number, query: string) => {
  if (query.length < 3) {
    return { data: [] }
  }

  let icons: string[] = []

  for (const baseURL of ICONIFY_ENDPOINTS) {
    try {
      const res = await ofetch<{ icons: string[] }>('/search', {
        baseURL,
        query: { query },
      })

      if (res?.icons?.length) {
        icons = res.icons
        break
      }
    } catch (err) {
      console.warn(`Iconify search failed at ${baseURL}`, err)
      continue
    }
  }

  return { data: icons }
})
