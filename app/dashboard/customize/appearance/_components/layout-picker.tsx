import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LayoutFormValues } from '@/lib/zod/schemas/biolink'
import { isEqual } from 'lodash'

interface LayoutOptionsProps {
  onClick: (values: LayoutFormValues) => void
  values: LayoutFormValues
}

export function FloatingAvatarLayout() {
  return (
    <ProfileCard>
      <Avatar className="absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1/2" />
      <NameAndBadges />
      <Bio />
      <Links />
    </ProfileCard>
  )
}

export function StackedLayout() {
  return (
    <ProfileCard className="items-start pt-4">
      <Avatar />
      <NameAndBadges inline />
      <Bio />
      <Links className="justify-start" />
    </ProfileCard>
  )
}

export function CompactRowLayout() {
  return (
    <ProfileCard className="max-w-[180px] pt-4">
      <div className="flex w-full items-center gap-2">
        <Avatar />
        <div className="space-y-1">
          <NameAndBadges inline />
          <Bio />
        </div>
      </div>
      <Links />
    </ProfileCard>
  )
}

export function LayoutPicker({ onClick, values }: LayoutOptionsProps) {
  const options = [
    {
      name: 'Floating Avatar',
      component: <FloatingAvatarLayout />,
      properties: {
        alignLeft: false,
        isBadgesNextToName: false,
        avatarPosition: 'float',
        maxWidth: 500,
      },
    },
    {
      name: 'Stacked',
      component: <StackedLayout />,
      properties: {
        alignLeft: true,
        isBadgesNextToName: true,
        avatarPosition: 'default',
        maxWidth: 500,
      },
    },
    {
      name: 'Compact Row',
      component: <CompactRowLayout />,
      properties: {
        alignLeft: true,
        isBadgesNextToName: true,
        avatarPosition: 'aside',
        maxWidth: 600,
      },
    },
  ] satisfies { name: string; component: React.ReactNode; properties: Partial<LayoutFormValues> }[]

  function isSelected(option: (typeof options)[number]) {
    const pickedValues = {
      alignLeft: values.alignLeft,
      isBadgesNextToName: values.isBadgesNextToName,
      avatarPosition: values.avatarPosition,
      maxWidth: values.maxWidth,
    } satisfies Partial<LayoutFormValues>

    return isEqual(pickedValues, option.properties)
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {options.map((option, idx) => (
          <Button
            type="button"
            key={idx}
            variant={isSelected(option) ? 'primary-secondary' : 'secondary'}
            className="relative h-44 flex-col"
            onClick={() => onClick({ ...values, ...option.properties })}
          >
            {option.component}
          </Button>
        ))}
      </div>
    </div>
  )
}

function Links({ className }: { className?: string }) {
  return (
    <div className={cn('flex w-full items-center justify-center gap-1', className)}>
      {new Array(3).fill(null).map((_, index) => (
        <div key={index} className="size-3 rounded-full bg-neutral-400" />
      ))}
    </div>
  )
}

function Bio() {
  return <div className="h-2 w-full rounded-md bg-neutral-400" />
}

function Avatar({ className }: { className?: string }) {
  return <div className={cn('size-8 shrink-0 rounded-full bg-neutral-400', className)} />
}

function NameAndBadges({ inline }: { inline?: boolean }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-1', inline && 'flex-row')}>
      <div className="h-2 w-9 rounded-md bg-neutral-400" />
      <div className="flex gap-1">
        {new Array(2).fill(null).map((_, index) => (
          <div key={index} className="size-2 rounded-full bg-neutral-400" />
        ))}
      </div>
    </div>
  )
}

function ProfileCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative mx-auto flex w-full max-w-[150px] flex-col items-center justify-center gap-2 rounded-xl p-3 pt-6',
        'border border-white/10 bg-white/15',
        className,
      )}
    >
      <div className="absolute top-2 right-2 h-3 w-6 rounded-full bg-neutral-400" />
      {children}
    </div>
  )
}
