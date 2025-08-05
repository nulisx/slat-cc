'use client'

import { Icon } from '@/components/ui/icon'

import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command-list'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Icons } from '@/lib/constants/icons'
import { searchIconifyIcons } from '@/lib/data/actions/search-iconify-icons'
import { useServerAction } from '@/lib/hooks/use-server-action'
import { cn } from '@/lib/utils'
import { debounce } from 'lodash'
import React from 'react'

const icons = [
  'game-icons:liberty-wing',
  'game-icons:ak47',
  'game-icons:pistol-gun',
  'ic:twotone-shield',
  'material-symbols-light:planet-rounded',

  'solar:star-bold-duotone',
  'lucide:stars',
  'material-symbols:link-rounded',
  'solar:link-bold-duotone',
  'solar:book-bold-duotone',

  'hugeicons:potion',
  'heroicons:heart-16-solid',
  'game-icons:heart-organ',
  'fluent:food-pizza-20-filled',
  'mdi:leaf',

  'tabler:award-filled',
  'tabler:ball-football',
  'tabler:background',
  'tabler:bomb-filled',
  'tabler:activity',

  'material-symbols:shield-person-rounded', // security / strength
  'mdi:account-circle', // user / identity
  'solar:bell-bold-duotone', // notification
  'solar:chat-round-bold-duotone', // communication
  'tabler:flame-filled', // energy / hype
  'game-icons:sand-snake',
  'mdi:music-circle', // audio / vibe
  'ph:globe-hemisphere-west-fill', // world / global
  'material-symbols:palette', // creativity
  'mdi:controller-classic', // alt controller icon
  'solar:moon-stars-bold-duotone', // night / aesthetic
  'tabler:eye-filled', // visibility / watch
  'material-symbols:psychology-alt-rounded', // insight / mental
  'mdi:medal', // achievement
  'solar:microphone-bold-duotone', // voice / audio
  'heroicons:photo-solid', // image
  'fluent:weather-sunny-20-filled', // light / bright
]

interface IconPickerProps {
  value?: string
  onChange: (iconName: string) => void
  placeholder?: string
  disabled?: boolean
  modal?: boolean
}

export function IconPicker({ value, onChange, placeholder = 'Select an icon', disabled, modal }: IconPickerProps) {
  const [items, setItems] = React.useState<string[]>(icons)
  const [icon, setIcon] = React.useState<string>(value || 'lucide:globe')
  const [loading, setLoading] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const { run: search } = useServerAction(searchIconifyIcons)

  const select = (value: string) => {
    setIcon(value)
    onChange?.(value)
  }

  const debouncedSearch = React.useMemo(() => {
    return debounce(async (query: string) => {
      try {
        const icons = await search(query)
        setItems(icons)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }, 1000)
  }, [search])

  const onValueChange = (query: string) => {
    setItems([])

    if (query.length < 3) {
      setLoading(false)
      setQuery(query)
      return
    }

    setLoading(true)
    setQuery(query)
    debouncedSearch(query)
  }

  return (
    <Popover modal={modal}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'bg-secondary text-foreground relative flex size-14 items-center justify-center rounded-full border shadow-lg transition',
            'border-foreground/10 hover:border-foreground/30 hover:shadow-xl',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <div
            className={cn(
              'bg-primary-600 hover:bg-primary-700 absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full text-white shadow-md',
              'p-1 transition-all',
            )}
          >
            <Icons.pencil className="size-3" />
          </div>
          <Icon name={icon} className="size-8 transition-transform group-hover:scale-105" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[228px] overflow-y-auto p-0">
        <Command>
          <CommandInput placeholder="Search for icons e.g. heart..." value={query} onValueChange={onValueChange} />
          {loading ? (
            <div className="flex h-20 flex-col items-center justify-center">
              <Icon name="eos-icons:three-dots-loading" className="size-10" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-20 flex-col items-center justify-center">
              <p className="text-muted-foreground text-sm">No icons found.</p>
            </div>
          ) : (
            <>
              <CommandGroup>
                <CommandList>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, idx) => (
                      <CommandItem
                        key={idx}
                        value={item}
                        onSelect={select}
                        className={cn(
                          'group cursor-pointer p-1',
                          item === icon ? 'text-primary' : 'hover:text-primary',
                        )}
                      >
                        <Icon name={item} className="size-6 shrink-0" />
                      </CommandItem>
                    ))}
                  </div>
                </CommandList>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
