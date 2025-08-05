import { BackgroundEffect } from '@/components/biolink/background-effects/background-effect'
import { PageOverlay } from '@/components/biolink/page-overlay'
import { getFontVariable } from '@/lib/data/biolink/constants'
import { Biolink } from '@/lib/data/biolink/schemas'
import { cn } from '@/lib/utils'
import { injectFontVariable } from '@/lib/utils/inject-font-variable'
import Image from 'next/image'
import * as React from 'react'

export function BiolinkPageProvider({
  className,
  children,
  biolink,
  preview,
}: {
  className?: string
  children: React.ReactNode
  biolink: Biolink
  preview?: boolean
}) {
  return (
    <>
      <div
        className={cn(
          'relative flex h-full w-full flex-col items-center justify-center overflow-hidden',
          injectFontVariable(biolink.textFont),
          injectFontVariable(biolink.nameFont),
          className,
        )}
        style={
          {
            '--text-color': biolink.textColor,
            '--name-color': biolink.nameColor,
            '--theme-color': biolink.themeColor,
            fontFamily: getFontVariable(biolink.textFont),
          } as React.CSSProperties
        }
      >
        {biolink.assets.cursor && <style>{`* { cursor: url(${biolink.assets.cursor}), auto !important; }`}</style>}
        <BackgroundEffect
          effect={biolink.enhancements.backgroundEffect}
          className={cn('pointer-events-none fixed inset-0 z-20 h-svh w-full', preview && 'absolute')}
          hueDeg={biolink.enhancements.backgroundEffectHue}
        />
        {biolink.assets.background && !biolink.assets.video && (
          <Image
            src={biolink.assets.background}
            alt="background"
            className={cn('pointer-events-none fixed inset-0 z-0 h-full w-full object-cover', preview && 'absolute')}
            priority
            height={1080}
            quality={100}
            width={1920}
          />
        )}
        <PageOverlay effect={biolink.enhancements.pageOverlay} className={cn(preview && 'absolute')} />
        {children}
      </div>
    </>
  )
}
