import { Icons, type IconType } from '@/lib/constants/icons'
import { paths } from '@/lib/constants/paths'
import { MdManageAccounts } from 'react-icons/md'

export type DashboardLink = {
  label: string
  path?: string // if path is not provided, it only holds children
  icon: IconType
  restricted?: boolean
  children?: DashboardLink[]
}

export const DASHBOARD_NAV = {
  overview: [
    {
      label: 'Dashboard',
      path: paths.dashboard.overview,
      icon: Icons.chartArea,
    },
  ],
  customize: [
    {
      label: 'Customize',
      icon: Icons.paintBrush,
      children: [
        {
          label: 'Appearance',
          path: paths.dashboard.customize.appearance,
          icon: Icons.palette,
        },
        {
          label: 'Links',
          path: paths.dashboard.customize.links,
          icon: Icons.link,
        },
        {
          label: 'Badges',
          path: paths.dashboard.customize.badges,
          icon: Icons.badge,
        },
        {
          label: 'Widgets',
          path: paths.dashboard.customize.widgets,
          icon: Icons.puzzlePiece,
        },
        {
          label: 'Tracks',
          path: paths.dashboard.customize.tracks,
          icon: Icons.music,
        },
      ],
    },
  ],
  manage: [
    {
      label: 'Settings',
      icon: Icons.settings,
      children: [
        {
          label: 'Account',
          path: paths.dashboard.settings.account,
          icon: MdManageAccounts,
        },
        {
          label: 'Metadata',
          path: paths.dashboard.settings.metadata,
          icon: Icons.article,
        },
        {
          label: 'Comments',
          path: paths.dashboard.settings.comments,
          icon: Icons.comment,
        },
      ],
    },
    {
      label: 'Templates',
      icon: Icons.folderOpen,
      children: [
        {
          label: 'Discover',
          path: paths.dashboard.templates.discover,
          icon: Icons.globe,
        },
        {
          label: 'Favorited',
          path: paths.dashboard.templates.favorited,
          icon: Icons.heart,
        },
        {
          label: 'Owned',
          path: paths.dashboard.templates.owned,
          icon: Icons.collections,
        },
      ],
    },
    {
      label: 'Staff',
      icon: Icons.shield,
      restricted: true,
      children: [
        {
          label: 'Overview',
          path: paths.dashboard.staff.manage,
          icon: Icons.shield,
        },
        {
          label: 'Featured Users',
          path: paths.dashboard.staff.users,
          icon: Icons.shield,
        },
        {
          label: 'Articles',
          path: paths.dashboard.staff.articles,
          icon: Icons.article,
        },
      ],
    },
  ],
  footer: [
    {
      label: 'Casino',
      path: paths.casino.root,
      icon: Icons.dice,
    },
    {
      label: 'Help',
      path: paths.docs.root,
      icon: Icons.helpCircle,
    },
  ],
} satisfies Record<string, DashboardLink[]>

export const DASHBOARD_LINKS = Object.values(DASHBOARD_NAV).flat()

export function resolvePath(link: DashboardLink): string {
  if (link.path) return link.path
  if (link.children?.length) return resolvePath(link.children[0])

  throw new Error(`No path nor children found for link: ${link.label}`)
}
