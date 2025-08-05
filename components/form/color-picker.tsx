'use client'

import { debounce } from 'lodash'
import * as React from 'react'
import { HexColorPicker } from 'react-colorful'

import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/lib/constants/icons'
import { useStorageStore } from '@/lib/stores/storage'
import { cn, isHexDark } from '@/lib/utils'
import { PiEyedropperBold } from 'react-icons/pi'
import { toast } from 'sonner'

const colorPresets = [
  '#fecaca', // red-200
  '#fca5a5', // red-300
  '#f87171', // red-400
  '#ef4444', // red-500
  '#dc2626', // red-600
  '#b91c1c', // red-700

  '#fecdd3', // rose-200
  '#fda4af', // rose-300
  '#fb7185', // rose-400
  '#f43f5e', // rose-500
  '#e11d48', // rose-600
  '#be123c', // rose-700

  '#fed7aa', // orange-200
  '#fdba74', // orange-300
  '#fb923c', // orange-400
  '#f97316', // orange-500
  '#ea580c', // orange-600
  '#c2410c', // orange-700

  '#fde68a', // amber-200
  '#fcd34d', // amber-300
  '#fbbf24', // amber-400
  '#f59e0b', // amber-500
  '#d97706', // amber-600
  '#b45309', // amber-700

  '#fef9c3', // yellow-200
  '#fef08a', // yellow-300
  '#fde047', // yellow-400
  '#eab308', // yellow-500
  '#ca8a04', // yellow-600
  '#a16207', // yellow-700

  '#d9f99d', // lime-200
  '#bef264', // lime-300
  '#a3e635', // lime-400
  '#84cc16', // lime-500
  '#65a30d', // lime-600
  '#4d7c0f', // lime-700

  '#bbf7d0', // green-200
  '#86efac', // green-300
  '#4ade80', // green-400
  '#22c55e', // green-500
  '#16a34a', // green-600
  '#15803d', // green-700

  '#a7f3d0', // emerald-200
  '#6ee7b7', // emerald-300
  '#34d399', // emerald-400
  '#10b981', // emerald-500
  '#059669', // emerald-600
  '#047857', // emerald-700

  '#99f6e4', // teal-200
  '#5eead4', // teal-300
  '#2dd4bf', // teal-400
  '#14b8a6', // teal-500
  '#0d9488', // teal-600
  '#0f766e', // teal-700

  '#a5f3fc', // cyan-200
  '#67e8f9', // cyan-300
  '#22d3ee', // cyan-400
  '#06b6d4', // cyan-500
  '#0891b2', // cyan-600
  '#0e7490', // cyan-700

  '#bfdbfe', // blue-200
  '#93c5fd', // blue-300
  '#60a5fa', // blue-400
  '#3b82f6', // blue-500
  '#2563eb', // blue-600
  '#1d4ed8', // blue-700

  '#c7d2fe', // indigo-200
  '#a5b4fc', // indigo-300
  '#818cf8', // indigo-400
  '#6366f1', // indigo-500
  '#4f46e5', // indigo-600
  '#4338ca', // indigo-700

  '#e9d5ff', // purple-200
  '#d8b4fe', // purple-300
  '#c084fc', // purple-400
  '#a855f7', // purple-500
  '#9333ea', // purple-600
  '#7e22ce', // purple-700

  '#fbcfe8', // pink-200
  '#f9a8d4', // pink-300
  '#f472b6', // pink-400
  '#ec4899', // pink-500
  '#db2777', // pink-600
  '#be185d', // pink-700

  '#ffffff', // white
  '#cbd5e1', // slate-300
  '#64748b', // slate-500
  '#475569', // slate-600
  '#0f172a', // slate-900
  '#000000', // black
]

interface Window {
  EyeDropper?: any
}

const MAX_COLORS = 18

export function ColorPicker({
  value,
  onChange,
  className,
  variant = 'input',
  optional,
  modal,
  children,
}: {
  value: string
  onChange: (color: string) => void
  className?: string
  optional?: boolean
  children?: React.ReactNode
  variant?: 'input' | 'button'
  modal?: boolean
}) {
  const [color, setColor] = React.useState(value)
  const [open, setOpen] = React.useState(false)
  const [eyeDropperSupported, setEyeDropperSupported] = React.useState(false)

  const debouncedChange = React.useMemo(() => debounce(onChange, 500), [onChange])

  const { colors: savedColors, addColor, removeColor } = useStorageStore()

  React.useEffect(() => {
    setColor(value)
  }, [value])

  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as Window).EyeDropper) {
      setEyeDropperSupported(true)
    }
  }, [])

  const onAddToStorage = (color: string) => {
    if (savedColors.includes(color)) return toast.error('Color already exists')
    if (savedColors.length >= MAX_COLORS) return toast.error('Max colors reached')

    addColor(color)
  }

  const onColorChange = (newColor: string) => {
    setColor(newColor)
    onChange(newColor)
  }

  const onColorChangeDebounced = (newColor: string) => {
    setColor(newColor)
    debouncedChange(newColor)
  }

  const onEyeDropperColorChange = async () => {
    if (!eyeDropperSupported) return

    try {
      const eyeDropper = new (window as Window).EyeDropper()
      const result = await eyeDropper.open()
      if (result?.sRGBHex) {
        onColorChange(result.sRGBHex)
      }
    } catch (e) {
      console.error('Error picking color:', e)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      {children ? (
        <PopoverTrigger asChild>{children}</PopoverTrigger>
      ) : (
        <PopoverTrigger asChild>
          <div className="relative flex w-full items-center gap-2">
            <button
              type="button"
              className="border-foreground/15 absolute top-1/2 left-2 z-10 size-[22px] shrink-0 -translate-y-1/2 rounded-lg border"
              style={{ backgroundColor: color }}
            />
            <Input value={color} onChange={(e) => onColorChange(e.target.value)} className="w-full pl-10 text-sm" />
            <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center">
              {eyeDropperSupported && (
                <button type="button" onClick={onEyeDropperColorChange} className="p-1 duration-300 hover:opacity-50">
                  <PiEyedropperBold className="text text-foreground size-[18px]" />
                </button>
              )}
              {optional && color && (
                <button
                  type="button"
                  onClick={() => {
                    setColor('')
                    onColorChange('')
                  }}
                  className="p-1 duration-300 hover:opacity-50"
                >
                  <Icons.trash className="text-destructive size-3.5" />
                </button>
              )}
            </div>
          </div>
        </PopoverTrigger>
      )}
      <PopoverContent className="w-[228px] p-3">
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="mb-3 grid grid-cols-2">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="picker">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="presets" className="space-y-2">
            <div className="flex max-h-44 flex-wrap gap-1 overflow-y-auto">
              {colorPresets.reverse().map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onColorChange(preset)}
                  className={cn(
                    'relative size-7 rounded-full border-2 transition-all',
                    color === preset && 'ring-2 ring-blue-500',
                  )}
                  style={{
                    backgroundColor: preset,
                  }}
                >
                  {color === preset && (
                    <div className="absolute inset-0 grid place-content-center">
                      <Icons.check
                        className={cn('size-3.5 text-white drop-shadow', !isHexDark(preset) && 'text-black')}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="picker" className="space-y-2">
            <HexColorPicker color={color} onChange={onColorChangeDebounced} />
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-xs">Your Colors</div>
              <button
                className="flex items-center gap-1 text-xs font-medium text-blue-500"
                type="button"
                onClick={() => onAddToStorage(color)}
              >
                <Icons.plus className="size-2.5" />
                Add New
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {savedColors.map((savedColor, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onColorChange(savedColor)}
                  className={cn(
                    'relative size-7 rounded-full border-2 transition-all',
                    color === savedColor && 'ring-2 ring-blue-500',
                  )}
                  style={{
                    backgroundColor: savedColor,
                  }}
                >
                  {color === savedColor && (
                    <div className="absolute inset-0 grid place-content-center">
                      <Icons.check
                        className={cn('size-3.5 text-white drop-shadow', !isHexDark(savedColor) && 'text-black')}
                      />
                    </div>
                  )}
                  <div
                    onClick={() => removeColor(savedColor)}
                    className="bg-foreground/30 text-foreground hover:bg-destructive/50 absolute -top-1 -right-1 rounded-full p-0.5 backdrop-blur-sm duration-200"
                  >
                    <Icons.close className="size-2.5" />
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
          <div className="relative mt-2">
            <div className="absolute top-1/2 left-3 -translate-y-1/2 text-xs">HEX</div>
            <Input value={color} onChange={(e) => onColorChange(e.target.value)} className="pl-10" />
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
