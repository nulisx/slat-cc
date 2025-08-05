import { Icon } from '@/components/ui/icon'
import { Icons } from '@/lib/constants/icons'
import { paths } from '@/lib/constants/paths'
import { embedPlatforms } from '@/lib/data/embeds/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function EmbedOptions() {
  return (
    <nav className="flex flex-wrap items-center gap-4 overflow-x-auto">
      {embedPlatforms.map((platform, idx) => (
        <Link
          href={{
            pathname: `${paths.dashboard.customize.widgets}/new`,
            query: { type: platform.options[0].type },
          }}
          key={idx}
          className={cn(
            'flex items-center gap-3 rounded-2xl py-2.5 pr-5 pl-4 text-white shadow-md duration-300 hover:opacity-80',
          )}
          style={{ backgroundColor: platform.color }}
        >
          <Icons.plusCircle className="size-4 text-white/75" />
          <Icon name={platform.icon} className="size-6" />
        </Link>
      ))}
    </nav>
  )
}
