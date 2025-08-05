import * as z from 'zod'
import { FieldOptionsWithPremium } from '@/lib/types'
import { unkebabCase } from '@/lib/utils'

export const textEffectSchema = z.enum([
  'typewriter',
  'cherry-blossoms',
  'shimmer',
  'shine',
  'glow',
  'shake',
  'glitch',
  'flames',
  'scramble',
  'rainbow',
  'flicker',
  'flip',
  'loading',
  'white-sparkles',
  'rainbow-sparkles',
  'green-sparkles',
  'black-sparkles',
  'lightblue-sparkles',
  'red-sparkles',
  'blue-sparkles',
  'orange-sparkles',
  'pink-sparkles',
  'purple-sparkles',
  'yellow-sparkles',
])

export type TextEffect = z.infer<typeof textEffectSchema>

const bioTextEffects: TextEffect[] = [
  textEffectSchema.enum.shake,
  textEffectSchema.enum.rainbow,
  textEffectSchema.enum.shine,
  textEffectSchema.enum.shimmer,
  textEffectSchema.enum.typewriter,
  textEffectSchema.enum.flicker,
  textEffectSchema.enum.flip,
  textEffectSchema.enum.loading,
  textEffectSchema.enum.glow,
  textEffectSchema.enum.glitch,
  textEffectSchema.enum.scramble,
]

function isBioTextEffect(effect: TextEffect): boolean {
  return bioTextEffects.includes(effect)
}

export const textEffectOptions = textEffectSchema.options.map((value) => ({
  label: unkebabCase(value),
  value,
  premium: true,
  bio: isBioTextEffect(value),
})) satisfies FieldOptionsWithPremium<TextEffect>

export type TextEffectOption = (typeof textEffectOptions)[number]

export function parseTextEffects(input?: string): TextEffect[] {
  if (!input) return []
  return input
    .split(/\s+/) // split by spaces
    .filter((effect) => textEffectSchema.options.includes(effect as TextEffect)) as TextEffect[]
}

export function parseTextEffect(input?: string): TextEffect | undefined {
  try {
    return textEffectSchema.parse(input)
  } catch {
    return undefined
  }
}
