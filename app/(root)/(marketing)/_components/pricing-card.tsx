import Image from 'next/image'
import Link from 'next/link'

import type { Plan } from '@/app/(root)/(marketing)/_sections/premium'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icons } from '@/lib/constants/icons'
import { paths } from '@/lib/constants/paths'

export function PricingCard({ plan }: { plan: Plan }) {
  return (
    <Card
      data-plan={plan.tier}
      darker
      className='text-foreground/80 group data-[plan="premium"]:to-primary-950 data-[plan="premium"]:border-primary-900 relative h-fit w-full space-y-5 self-end rounded-2xl p-5 text-left data-[plan="premium"]:overflow-hidden data-[plan="premium"]:bg-linear-to-b'
    >
      {plan.tier === 'premium' && (
        <Image
          src="/images/premium-card.png"
          alt="Money"
          width={250}
          height={250}
          className="absolute inset-0 h-1/2 w-full mask-b-from-0% mask-b-to-100% object-cover opacity-50"
        />
      )}
      <div className='group-data-[plan="premium"]:border-primary/40 relative flex flex-col gap-4'>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className='group-data-[plan="premium"]:bg-primary h-2.5 w-4 shrink-0 rounded-full bg-white' />
            <h4 className="text-foreground text-sm font-semibold">{plan.title}</h4>
          </div>
          <div className="flex items-baseline gap-1">
            <div className="text-foreground text-xl font-semibold">
              $<span className="text-4xl drop-shadow-[0_0_4px_black]">{plan.price}</span>
            </div>
            <div className="text-sm">/lifetime</div>
          </div>
          <p className="text-sm">{plan.description} </p>
        </div>
        <hr className='border-b border-dashed group-data-[plan="premium"]:border-white/10' />
        {plan.tier === 'premium' ? (
          <Link href={paths.dashboard.settings.account} passHref>
            <Button variant="primary-glossy" className="w-full">
              {plan.callToAction}
            </Button>
          </Link>
        ) : (
          <Link href={paths.auth.register} passHref>
            <Button variant="secondary-glossy" className="w-full bg-gradient-to-b from-neutral-700 to-neutral-800">
              {plan.callToAction}
            </Button>
          </Link>
        )}
      </div>
      <div>
        <div className="mb-4 text-xs italic">{plan.title} plan includes:</div>
        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <Icons.check className="text-foreground text-primary inline-block size-3" />
              <div className="text-foreground text-sm whitespace-nowrap">{feature}</div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
