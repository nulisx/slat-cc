import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command-list'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Icons } from '@/lib/constants/icons'
import { textEffectOptions } from '@/lib/data/biolink/constants'
import { cn } from '@/lib/utils'
import * as React from 'react'
import { FiEdit3 } from 'react-icons/fi'

export function TextEffectPicker({
  value,
  onChange,
  premium,
  multiple,
  children,
}: {
  value: string[]
  onChange: (value: string[]) => void
  premium: boolean
  multiple?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  const options = multiple ? textEffectOptions : textEffectOptions.filter((opt) => opt.bio)

  const handleSelect = (effectValue: string) => {
    const isSelected = value.includes(effectValue)

    if (multiple) {
      if (!isSelected && value.length >= 3) return
      const updated = isSelected ? value.filter((v) => v !== effectValue) : [...value, effectValue]
      onChange(updated)
    } else {
      onChange(isSelected ? [] : [effectValue])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group border-foreground/20 bg-tertiary hover:border-foreground flex w-full items-center gap-2 rounded-lg border-2 border-dashed p-4 shadow-sm duration-300"
        >
          <Badge>
            <FiEdit3 className="h-4 w-4" />
          </Badge>
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] overflow-y-auto p-0">
        <Command>
          <CommandInput placeholder="Search effects..." />
          <CommandEmpty>No effects found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {options.map((effect, idx) => {
                const isSelected = value.includes(effect.value)
                const isLocked = !premium && effect.premium

                return (
                  <CommandItem
                    key={idx}
                    value={effect.value}
                    onSelect={() => !isLocked && handleSelect(effect.value)}
                    disabled={isLocked}
                    className={cn('flex items-center justify-start gap-2', isLocked && 'opacity-50')}
                  >
                    {isLocked ? (
                      <Icons.lock className="text-primary-800 h-3.5 w-3.5" />
                    ) : (
                      <Icons.check className={cn('h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                    )}
                    <span>{effect.label}</span>
                  </CommandItem>
                )
              })}
            </CommandList>
          </CommandGroup>
          {value.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => onChange([])}
                className="hover:bg-foreground/2.5 flex w-full items-center justify-start gap-2 border-t px-3 py-2 text-sm duration-200"
              >
                <Icons.trash className="text-destructive size-3.5" />
                {multiple ? 'Clear all effects' : 'Remove effect'}
              </button>
              <CommandSeparator />
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
