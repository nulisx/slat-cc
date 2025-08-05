'use client'

import * as React from 'react'

import { IconContainer } from '@/components/icon-container'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { IconType } from '@/lib/constants/icons'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { cn } from '@/lib/utils'

interface ResponsiveModalProps {
  icon?: IconType | string
  title: string
  description?: string
  trigger?: React.ReactNode
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  dialogClassName?: string
}

export function ResponsiveModal({
  icon: Icon,
  title,
  description,
  trigger,
  children,
  open,
  setOpen,
  dialogClassName,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)') // md

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={cn('sm:max-w-[405px]', dialogClassName)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5">
              {Icon && <IconContainer icon={Icon} />}
              {title}
            </DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="overflow-y-auto">{children}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} modal>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            {Icon && <IconContainer icon={Icon} />}
            {title}
          </DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto px-4 pb-4">{children}</ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
