'use client'

import { Marquee } from '@/components/ui/marquee'
import { cn, hexToRgba } from '@/lib/utils'

export type MatrixColor = 'green' | 'orange' | 'gray' | 'red' | 'pink' | 'cyan'

export type ScrollingDotMatrixProps = {
  message?: string
  noRepeat?: boolean
  color?: MatrixColor
  highlightMessage?: string
}

export const ScrollingDotMatrix = ({
  highlightMessage,
  className,
  message,
  color,
  noRepeat,
}: {
  className?: string
} & ScrollingDotMatrixProps) => {
  const matrixColorToHex = {
    green: '#97EE0E',
    red: '#fe8234',
    gray: '#a3a3a3',
    orange: '#ff8c00',
    pink: '#F712E9',
    cyan: '#05F7F6',
  } satisfies Record<MatrixColor, string>

  const matrixColor = matrixColorToHex[color || 'gray']

  return (
    <Marquee
      className={cn('font-quantico h-9 w-full overflow-hidden border mask-none', className)}
      style={{
        borderColor: hexToRgba(matrixColor, 0.1),
        background: hexToRgba(matrixColor, 0.5),
      }}
      scrollerClassName="py-0 gap-0"
    >
      <div
        className={cn('flex h-9 w-full')}
        style={{
          background: `repeating-linear-gradient(0deg,#000,#000 3px, ${hexToRgba(matrixColor, 0.1)} 0, ${hexToRgba(
            matrixColor,
            0.05,
          )} 4px),repeating-linear-gradient(90deg,#000,#000 3px, ${hexToRgba(matrixColor, 0.1)} 0, ${hexToRgba(
            matrixColor,
            0.05,
          )} 4px)`,
        }}
      >
        {message &&
          new Array(noRepeat ? 1 : 20).fill(message).map((_, idx) => (
            <li
              key={idx}
              className={cn('ml-4 flex items-center whitespace-nowrap lowercase')}
              style={{
                color: matrixColor,
                filter: `drop-shadow(0 0 1px ${matrixColor})`,
              }}
            >
              <span>{message}</span>
              {highlightMessage && highlightMessage.trim().length > 0 && (
                <span
                  className="ml-2 text-black lowercase"
                  style={{
                    backgroundColor: hexToRgba(matrixColor),
                    filter: `drop-shadow(0 0 5px ${matrixColor})`,
                  }}
                >
                  {highlightMessage}
                </span>
              )}
            </li>
          ))}
      </div>
    </Marquee>
  )
}
