import { Container } from '@/app/(root)/(marketing)/_components/container'
import { Header } from '@/app/docs/_components/header'
import { NavSidebar } from '@/app/docs/_components/nav-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { constructMetadata } from '@/lib/utils'
import Image from 'next/image'

export const revalidate = 86400 // 24 hours

export const metadata = constructMetadata({
  templateTitle: 'Docs',
  description: `Documentation for Slat.cc`,
})

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  return (
    <SidebarProvider>
      <NavSidebar variant="sidebar" />
      <SidebarInset>
        <Image
          src="/images/waves.svg"
          width={32}
          height={32}
          alt="abstract waves"
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -z-10 w-full max-w-7xl -translate-x-1/2 transform opacity-50 hue-rotate-[250deg]"
        />
        <Header slug={slug} />
        <Container className="max-w-7xl">{children}</Container>
      </SidebarInset>
    </SidebarProvider>
  )
}
