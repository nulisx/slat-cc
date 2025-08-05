import { Embed } from '@/components/biolink/embeds/embed'
import type { Biolink } from '@/lib/data/biolink/schemas'
import type { Embed as EmbedType } from '@/lib/data/embeds/schemas'
import { cn } from '@/lib/utils'

/** Renders a list of embeds inside the profile card. */

export function EmbedList({ biolink, embeds }: { biolink: Biolink; embeds: EmbedType[] }) {
  return (
    <div className={cn('grid grid-cols-1 gap-3', biolink.layout.maxWidth >= 600 && 'md:grid-cols-2')}>
      {embeds.map((item, idx) => {
        const isLastItem = idx === embeds.length - 1
        const isEvenIndex = idx % 2 === 0

        return (
          <div key={item.id} className={cn('w-full', isEvenIndex && isLastItem ? 'md:col-span-2' : 'md:col-span-1')}>
            <Embed
              key={item.id}
              embed={item}
              card={biolink.card}
              container={biolink.container}
              colors={{
                text: biolink.textColor,
                theme: biolink.themeColor,
                name: biolink.nameColor,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
