import { Beam } from '@/app/(root)/(marketing)/_components/beam'
import { Card } from '@/components/ui/card'
import { Icons } from '@/lib/constants/icons'
import { paths } from '@/lib/constants/paths'
import Link from 'next/link'

export function AuthFormWrapper({
  children,
  title,
  description,
}: React.PropsWithChildren<{
  title: string
  description?: string
}>) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <Card darker className="overflow-hidden p-5">
        <Beam className="-top-px" />
        <Beam className="-top-px" />
        <Link href={paths.root} className="mb-4 block">
          <div className="from-primary-500 to-primary-950 w-fit rounded-xl bg-linear-to-br p-2">
            <Icons.logo className="size-7 text-white" />
          </div>
        </Link>
        <AuthHeader title={title} description={description} />
        {children}
      </Card>
    </div>
  )
}

export function AuthHeader({ title = '', description = '' }) {
  return (
    <div className="item-start mb-4 flex flex-col gap-2">
      <h2 className="text-foreground text-2xl font-semibold">{title}</h2>
      {description && <div className="text-muted-foreground text-base">{description}</div>}
    </div>
  )
}
