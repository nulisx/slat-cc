import { Viewport } from 'next'
import { getThemeColor } from '@/lib/data/actions/get-theme-color'

export async function generateViewportMetadata(username: string): Promise<Viewport> {
  const themeColor = await getThemeColor({ username })

  return { themeColor }
}
