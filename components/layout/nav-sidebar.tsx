import { NavFooter } from '@/components/layout/nav-footer'
import { LogoutButton } from '@/components/layout/nav-logout-button'
import { NavMain } from '@/components/layout/nav-main'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Icons } from '@/lib/constants/icons'
import { paths } from '@/lib/constants/paths'
import { isStaff } from '@/lib/data/users/actions'
import { getCurrentUser } from '@/lib/data/users/actions/get-current-user'
import { formatLargeNumber } from '@/lib/utils'
import Link from 'next/link'
import { LuUser } from 'react-icons/lu'

export async function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, staff] = await Promise.all([getCurrentUser(), await isStaff()])

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4 pt-6">
        <SidebarMenu>
          <Link href={paths.root} className="flex items-center gap-1">
            <div className="text-primary flex aspect-square size-8 items-center justify-center rounded-lg">
              <Icons.logo className="size-6" />
            </div>
            <span className="truncate text-left text-xl font-medium">slat.cc</span>
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <NavMain staff={staff} />
        <NavFooter className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <div className="space-y-3 px-1 py-2">
          <Link
            target="_blank"
            rel="noopener nofollow"
            href={`/${user?.username}`}
            className="bg-foreground/2.5 text-foreground border-foreground/2.5 hover:bg-foreground/5 flex items-center gap-x-2 rounded-2xl border px-3 py-2 text-sm font-medium duration-200"
          >
            <Icons.externalLink className="text-muted-foreground size-3.5" />
            View Profile
          </Link>
          <div className="bg-foreground/2.5 border-foreground/2.5 flex items-center gap-3 rounded-full border p-1.5">
            <div className="text-foreground bg-foreground/5 grid size-10 place-content-center rounded-full">
              <LuUser className="size-5" />
            </div>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold">{user?.username}</span>
              <div className="text-muted-foreground truncate text-sm">UID {formatLargeNumber(user?.id || 0)}</div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
