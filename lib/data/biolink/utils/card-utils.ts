import { Biolink } from '@/lib/data/biolink/schemas'

export const CARD_TRANSPARENT_VALUES = {
  borderWidth: 0,
  borderOpacity: 0,
  backgroundOpacity: 0,
  backgroundBlur: 0,
  shadowOpacity: 0,
} as const as Readonly<Partial<Biolink['card']>>

export function isCardTransparent(values: Partial<Biolink['card']>): boolean {
  return Object.entries(CARD_TRANSPARENT_VALUES).every(([key, val]) => values[key as keyof Biolink['card']] === val)
}

export const CONTAINER_TRANSPARENT_VALUES: Partial<Biolink['container']> = {
  borderWidth: 0,
  backgroundOpacity: 0,
  borderOpacity: 0,
}

export function isContainerTransparent(values: Partial<Biolink['container']>): boolean {
  return values.backgroundOpacity === 0 && (values.borderWidth === 0 || values.borderOpacity === 0)
}
