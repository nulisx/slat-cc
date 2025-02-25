/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useRef } from 'react'

import { cn } from '@slat/utils'

// components/biolink/effects/thunder-effect.tsx

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
      let lastTime: number = 0
      const vendors: string[] = ['ms', 'moz', 'webkit', 'o']
      for (let x: number = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[(vendors[x] + 'RequestAnimationFrame') as keyof Window]
        window.cancelAnimationFrame =
          window[(vendors[x] + 'CancelAnimationFrame') as keyof Window] ||
          window[(vendors[x] + 'CancelRequestAnimationFrame') as keyof Window]
      }

      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback: FrameRequestCallback): number {
          const currTime: number = new Date().getTime()
          const timeToCall: number = Math.max(0, 16 - (currTime - lastTime))
          const id: number = window.setTimeout(function () {
            callback(currTime + timeToCall)
          }, timeToCall)
          lastTime = currTime + timeToCall
          return id
        }
      }

      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id: number): void {
          clearTimeout(id)
        }
      }
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
        lightning.push({
          x: x,
          y: y,
          xRange: rand(5, 30),
          yRange: rand(5, 25),
          path: [{ x: x, y: y }],
          pathLimit: rand(10, 35),
          canSpawn: canSpawn,
          hasFired: false,
        })
      }

      const updateL = (): void => {
        let i: number = lightning.length
        while (i--) {
          const light: Lightning = lightning[i]
          light.path.push({
            x: light.path[light.path.length - 1].x + (rand(0, light.xRange) - light.xRange / 2),
            y: light.path[light.path.length - 1].y + rand(0, light.yRange),
          })

          if (light.path.length > light.pathLimit) {
            lightning.splice(i, 1)
          }
          light.hasFired = true
        }
      }

      const renderL = (): void => {
        let i: number = lightning.length
        while (i--) {
          const light: Lightning = lightning[i]
          const baseBlue = 'hsla(200, 100%, 50%, '
          const baseWhite = 'hsla(0, 100%, 100%, '

          const lineColor = applyBlueColor
            ? `${baseBlue}${rand(10, 100) / 100})`
            : `${baseWhite}${rand(10, 100) / 100})`

          // ...
}
