'use client'

import Image from 'next/image'
import Typewriter from 'typewriter-effect'

import { Tooltip } from '@/components/ui/tooltip'
import type { Font, TextEffect } from '@/lib/data/biolink/constants'
import {
  getFontVariable,
  textEffectOptions,
  textEffectSchema,
  type TextEffectOption,
} from '@/lib/data/biolink/constants'
import { cn, hexToRgba, joinStringsWithSpaces } from '@/lib/utils'
import { FlamesText } from './text-effects/flames-text'
import { FlickerText } from './text-effects/flicker-text'
import { FlipText } from './text-effects/flip-text'
import { GlitchText } from './text-effects/glitch-text'
import { LoadingText } from './text-effects/loading-text'
import { ScrambleText } from './text-effects/scramble-text'

export const getShimmerStyles = (textColor: string): React.CSSProperties => ({
  background: `linear-gradient(90deg, transparent, ${hexToRgba(textColor)}, transparent)`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '80%',
  animation: 'shining 2s linear infinite',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: `${hexToRgba(textColor, 0.25)}`,
  backgroundClip: 'text',
})

export const getShineStyles = (textColor: string): React.CSSProperties => ({
  background: `linear-gradient(90deg, transparent, ${hexToRgba(textColor)}, transparent)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '80%',
  animation: 'shine 3s linear infinite',
  position: 'relative',
})

const generateSparklesUrl = (sparklesEffect: TextEffectOption): string => {
  const color = sparklesEffect ? sparklesEffect.value.split('-')[0] : 'white'
  return `/effects/${color}.gif`
}

export function DisplayName({
  title,
  options,
  className,
}: {
  title: string
  options: {
    tooltip?: string
    color: string
    effects: TextEffect[]
    font: Font
  }
  className?: string
}) {
  const sparklesEffect = textEffectOptions.find(
    (effect) => options.effects.includes(effect.value) && effect.value.includes('sparkles'),
  )
  const cssEffects = [textEffectSchema.enum.shake, textEffectSchema.enum.rainbow, textEffectSchema.enum.shine].filter(
    (effect) => options.effects.includes(effect),
  )

  const combedCssClasses = joinStringsWithSpaces(cssEffects.map((effect) => `${effect}-effect`))

  return (
    <TitleTooltip tooltip={options.tooltip}>
      {options.effects.includes('cherry-blossoms') && (
        <Image
          src="/effects/cherry-blossoms.gif"
          alt="cherry blossoms"
          unoptimized
          width="0"
          height="0"
          sizes="100vw"
          className="absolute h-full w-full object-cover"
        />
      )}
      {sparklesEffect && (
        <Image
          src={generateSparklesUrl(sparklesEffect)}
          alt="sparkle"
          unoptimized
          width="0"
          height="0"
          sizes="100vw"
          className="absolute h-full w-full object-cover"
        />
      )}
      <h2
        className={cn(
          'relative w-fit bg-transparent text-[28px] font-medium tracking-wider text-wrap break-all',
          className,
          combedCssClasses,
        )}
        style={{
          color: options.color,
          fontFamily: getFontVariable(options.font),
          filter: options.effects.includes('glow') ? `drop-shadow(0 0 0.25rem ${options.color})` : undefined,
          ...(options.effects.includes('shimmer') && getShimmerStyles(options.color)),
          ...(options.effects.includes('shine') && getShineStyles(options.color)),
        }}
        data-text={title}
      >
        {options.effects.includes('typewriter') ? (
          <Typewriter
            options={{
              strings: title,
              autoStart: true,
              loop: true,
            }}
          />
        ) : options.effects.includes('flicker') ? (
          <FlickerText title={title} color={options.color} />
        ) : options.effects.includes('flip') ? (
          <FlipText text={title} color={options.color} />
        ) : options.effects.includes('loading') ? (
          <LoadingText text={title} />
        ) : options.effects.includes('flames') ? (
          <FlamesText text={title} color={options.color} />
        ) : options.effects.includes('glitch') ? (
          <GlitchText text={title} />
        ) : options.effects.includes('scramble') ? (
          <ScrambleText text={title} />
        ) : (
          title
        )}
      </h2>
    </TitleTooltip>
  )
}

function TitleTooltip({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) {
  if (!tooltip) return <div className="relative w-fit">{children}</div>

  return (
    <Tooltip content={tooltip}>
      <div className="relative">{children}</div>
    </Tooltip>
  )
}
