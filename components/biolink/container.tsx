'use client'

import type { Biolink } from '@/lib/data/biolink/schemas'
import { isContainerTransparent } from '@/lib/data/biolink/utils/card-utils'
import { cn, hexToRgba } from '@/lib/utils'
import * as React from 'react'

export interface ContainerProps {
  container: Biolink['container']
  borderRadius: number
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  isInsideProfileCard?: boolean
}

export function Container({
  container,
  borderRadius,
  children,
  className,
  style,
  isInsideProfileCard,
}: React.PropsWithChildren<ContainerProps>) {
  const isTransparent = isContainerTransparent(container)

  const containerStyle = {
    backgroundColor: hexToRgba(container.backgroundColor, container.backgroundOpacity / 100),
    borderRadius: isInsideProfileCard ? `${borderRadius}px` : `${Math.min(borderRadius, 25)}px`,
    borderColor: hexToRgba(container.borderColor, container.borderOpacity / 100),
    borderWidth: `${container.borderWidth}px`,
  } satisfies React.CSSProperties

  return (
    <div
      style={{ ...(!isTransparent && containerStyle), ...style }}
      className={cn(!isInsideProfileCard && 'p-1.5', isTransparent && 'p-0!', className)}
    >
      {children}
    </div>
  )
}
