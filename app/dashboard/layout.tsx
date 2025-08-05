import { NavSidebar } from '@/components/layout/nav-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { constructMetadata } from '@/lib/utils'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export const metadata = constructMetadata({
  templateTitle: 'Dashboard',
  description: 'Customize your bio page and manage your account settings.',
  noIndex: true,
})

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const defaultOpen = (await cookies()).get('sidebar:state')?.value === 'true'

  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <NavSidebar variant="sidebar" />
        <SidebarInset className="lg:h-svh lg:overflow-y-hidden">
          <div className="hidden h-[14px] w-full shrink-0 lg:block" />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
