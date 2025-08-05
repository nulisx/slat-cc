import { verifySession } from '@/lib/auth/session'
import { Suspense } from 'react'
import { Footer } from './_components/footer'
import { Header } from './_components/header'
import { ScrollToTop } from './_components/scroll-to-top'

export const experimental_ppr = true

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <div className="overflow-x-hidden">
        <Suspense fallback={null}>
          <AsyncHeader />
        </Suspense>
        {children}
        <Footer />
      </div>
    </>
  )
}

async function AsyncHeader() {
  const session = await verifySession()
  return <Header authenticated={!!session} />
}
