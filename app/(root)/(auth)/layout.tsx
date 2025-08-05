import { RootLayout } from '@/components/hills-background'

export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <RootLayout className="flex flex-col items-center justify-center">{children}</RootLayout>
}
