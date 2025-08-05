import { Premium } from '@/app/(root)/(marketing)/_sections/premium'
import { CallToAction } from './_sections/call-to-action'
import { FAQ } from './_sections/faq'
import { Features } from './_sections/features'
import { Hero } from './_sections/hero'
import { Integrations } from './_sections/integrations'
import { Metrics } from './_sections/metrics'

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Metrics />
      <Features />
      <Integrations />
      <Premium />
      <FAQ />
      <CallToAction />
    </div>
  )
}
