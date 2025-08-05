/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
interface Lightning {
  x: number
  y: number
  xRange: number
  yRange: number
  path: { x: number; y: number }[]
  pathLimit: number
  canSpawn: boolean
  hasFired: boolean
}

export function ThunderEffect({ className, hueDeg = 0 }: { className?: string; hueDeg?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  let ctx: CanvasRenderingContext2D | null = null
  let cw: number = 0
  let ch: number = 0

  const applyBlueColor = hueDeg !== 0

  useEffect(() => {
    const isCanvasSupported = (): boolean => {
      const elem = document.createElement('canvas')
      return !!(elem.getContext && elem.getContext('2d'))
    }

    const setupRAF = (): void => {
      /** REDACTED */
    }

    const canvasLightning = function (c: HTMLCanvasElement, cw: number, ch: number): void {
      let lightning: Lightning[] = []
      let lightTimeCurrent: number = 0
      let lightTimeTotal: number = 50

      const init = (): void => {
        loop()
      }

      const rand = (rMi: number, rMa: number): number => {
        return ~~(Math.random() * (rMa - rMi + 1)) + rMi
      }

      const createL = (x: number, y: number, canSpawn: boolean): void => {
        /** REDACTED */
      }

      const updateL = (): void => {
        /** REDACTED */
      }

      const renderL = (): void => {
        let i: number = lightning.length
        while (i--) {
          /** REDACTED */
        }
      }

      const lightningTimer = (): void => {
        /** REDACTED */
      }

      const clearCanvas = (): void => {
        /** REDACTED */
      }

      const loop = (): void => {
        const loopIt = (): void => {
          requestAnimationFrame(loopIt)
          clearCanvas()
          updateL()
          lightningTimer()
          renderL()
        }
        loopIt()
      }

      init()
    }

    if (isCanvasSupported()) {
      const c: HTMLCanvasElement = canvasRef.current!
      cw = c.width = window.innerWidth
      ch = c.height = window.innerHeight
      ctx = c.getContext('2d')
      // @ts-ignore
      new canvasLightning(c, cw, ch)

      setupRAF()
    }
  }, [])
  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      className={cn('fixed inset-0 h-full w-full', className)}
      style={{
        filter: applyBlueColor ? `hue-rotate(${hueDeg}deg)` : undefined,
      }}
    />
  )
}
