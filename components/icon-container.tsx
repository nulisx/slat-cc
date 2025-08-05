import { Icon as AppIcon } from '@/components/ui/icon'
import type { IconType } from '@/lib/constants/icons'
import { cn } from '@/lib/utils'

type IconContainerSize = 'md' | 'xl' | '2xl'

type IconColor = 'primary' | 'white' | 'destructive'

const iconStyle: Record<IconContainerSize, string> = {
  md: 'size-4',
  xl: 'size-6',
  '2xl': 'size-8',
}

const iconColor: Record<IconColor, string> = {
  primary: 'text-primary-500',
  white: 'text-white',
  destructive: 'text-destructive',
}

const containerStyle: Record<IconContainerSize, string> = {
  md: 'size-8 rounded-xl',
  xl: 'size-12 rounded-[1.2rem]',
  '2xl': 'size-14 rounded-[1.2rem]',
}

interface IconContainerProps {
  size?: IconContainerSize
  icon?: IconType | string
  color?: IconColor
  background?: 'light' | 'dark'
  children?: React.ReactNode
}

export function IconContainer({
  icon: Icon,
  color = 'primary',
  size = 'md',
  background = 'dark',
  children,
}: IconContainerProps) {
  const iconClass = cn('shrink-0', iconStyle[size], iconColor[color])

  return (
    <div
      className={cn(
        'group relative border border-white/[0.03] bg-gradient-to-br shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_1px_3px_rgba(0,0,0,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.2)] transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 before:transition-opacity after:absolute after:inset-0 after:z-[-1] after:rounded-2xl after:bg-gradient-to-t after:from-black/30 after:to-transparent',
        background === 'dark' ? 'from-[#1a1a1a] to-[#0a0a0a]' : 'from-[#2d2d2d] to-[#202020]',
        'grid shrink-0 place-content-center',
        containerStyle[size],
      )}
    >
      {children ? (
        children
      ) : typeof Icon === 'string' ? (
        <AppIcon name={Icon} className={iconClass} />
      ) : (
        Icon && <Icon className={iconClass} />
      )}
    </div>
  )
}
