import { colorRegex } from '@/lib/data/schemas'
import { match } from 'ts-pattern'

export const isHexValid = (hex: string) => colorRegex.test(hex)

export function hexToRgba(hex: string, opacity = 1): string {
  if (!isHexValid(hex)) return `rgba(255, 255, 255, ${opacity})`

  // remove the '#' if it exists
  const sanitizedHex = hex.startsWith('#') ? hex.slice(1) : hex

  const r = parseInt(sanitizedHex.substring(0, 2), 16)
  const g = parseInt(sanitizedHex.substring(2, 4), 16)
  const b = parseInt(sanitizedHex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const getEffectColor = (hueDeg: number): string => {
  return match(hueDeg)
    .with(0, () => '#FFFFFF')
    .with(360, () => '#000000')
    .otherwise(() => '#2563eb')
}

/**
 * Adjusts a hex color by a percentage.
 * Positive percentage lightens the color, negative percentage darkens it.
 * @example: adjustHexColor('#ff0000', 20) returns a lighter red.
 * @example: adjustHexColor('#ff0000', -20) returns a darker red.
 */
export function adjustHexColor(hex: string, percent: number): string {
  const sanitizeHex = (hex: string) => (hex.startsWith('#') ? hex.slice(1) : hex)

  const toChannel = (component: string) => parseInt(component, 16)

  const adjustChannel = (value: number) => {
    const adjusted = value + (percent / 100) * (percent > 0 ? 255 - value : value)
    return Math.round(Math.min(255, Math.max(0, adjusted)))
      .toString(16)
      .padStart(2, '0')
  }

  const cleanHex = sanitizeHex(hex)

  if (cleanHex.length !== 6) {
    throw new Error(`Invalid HEX color: ${hex}`)
  }

  const r = adjustChannel(toChannel(cleanHex.slice(0, 2)))
  const g = adjustChannel(toChannel(cleanHex.slice(2, 4)))
  const b = adjustChannel(toChannel(cleanHex.slice(4, 6)))

  return `#${r}${g}${b}`.toUpperCase()
}

export function isHexDark(color: string, threshold = 200): boolean {
  const hex = color.replace('#', '')
  if (hex.length !== 6) return false
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return (r + g + b) / 3 < threshold
}

export function getGradientPair(color: string): string {
  const hsl = hexToHSL(color)
  hsl.h = (hsl.h + 40) % 360 // move "up" the rainbow

  return hslToHex(hsl)
}

function hexToHSL(hex: string) {
  let r = 0,
    g = 0,
    b = 0

  hex = hex.replace('#', '')
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else {
    r = parseInt(hex.slice(0, 2), 16)
    g = parseInt(hex.slice(2, 4), 16)
    b = parseInt(hex.slice(4, 6), 16)
  }

  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  const l = (max + min) / 2
  let s = 0

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60
        break
      case g:
        h = ((b - r) / delta + 2) * 60
        break
      case b:
        h = ((r - g) / delta + 4) * 60
        break
    }
  }

  return { h, s, l }
}

function hslToHex({ h, s, l }: { h: number; s: number; l: number }): string {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0,
    g = 0,
    b = 0

  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  const toHex = (n: number) => {
    const val = Math.round((n + m) * 255)
    return val.toString(16).padStart(2, '0')
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
