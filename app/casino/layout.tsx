import { cn, constructMetadata } from '@/lib/utils'
import { Press_Start_2P, VT323 } from 'next/font/google'

export const dynamic = 'force-dynamic'

export const metadata = constructMetadata({
  templateTitle: 'Casino',
  description: 'Gamble and win big!',
})

const quantico = VT323({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-quantico',
})

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-press-start-2p',
})

export default function CasinoLobbyLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn(quantico.variable, pressStart2P.className, 'font-press-start-2p')}>{children}</div>
}
