'use client'

import type { BackgroundEffect } from '@/lib/data/biolink/constants'
import { useMounted } from '@/lib/hooks/use-mounted'
import { cn } from '@/lib/utils'
import { match } from 'ts-pattern'
import { AuroraEffect } from './aurora-background'
import { AuroraSpotlightEffect } from './aurora-spotlight-effect'
import { CashRainEffect } from './cash-rain-effect'
import { PetalsEffect } from './cherry-blossoms-effect'
import { GalaxyEffect } from './galaxy-effect'
import { ParticlesEffect } from './particles-effect'
import { RainEffect } from './rain-effect'
import { SnowfallEffect } from './snowfall-effect'
import { SpotlightEffect } from './spotlight-effect'
import { ThunderEffect } from './thunder-effect'

interface BackgroundEffectProps {
  effect?: BackgroundEffect
  className?: string
  hueDeg?: number
}

export function BackgroundEffect({ effect, className, hueDeg }: BackgroundEffectProps) {
  const mounted = useMounted()

  if (!mounted) return null

  return match(effect)
    .with('aurora-spotlight', () => <AuroraSpotlightEffect className={className} hue={hueDeg} />)
    .with('galaxy', () => <GalaxyEffect className={className} hue={hueDeg} />)
    .with('petals', () => <PetalsEffect className={className} hueDeg={hueDeg} />)
    .with('snowflakes', () => <ParticlesEffect className={className} hueDeg={hueDeg} />)
    .with('snowfall', () => <SnowfallEffect className={className} hueDeg={hueDeg} />)
    .with('rain', () => <RainEffect className={className} hueDeg={hueDeg} />)
    .with('thunder', () => <ThunderEffect className={className} hueDeg={hueDeg} />)
    .with('cash-rain', () => <CashRainEffect className={className} hueDeg={hueDeg} />)
    .with('aurora', () => <AuroraEffect className={className} hueDeg={hueDeg} />)
    .with('spotlight', () => <SpotlightEffect className={cn('-top-10 left-1/4 md:-top-20', className)} fill="white" />)
    .otherwise(() => null)
}
