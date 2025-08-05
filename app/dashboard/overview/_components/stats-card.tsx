import { IconContainer } from '@/components/icon-container'
import { Card } from '@/components/ui/card'
import { Skeleton, SkeletonContent } from '@/components/ui/skeleton'
import { IconType } from 'react-icons'

export const StatsCard = ({ label, value, icon: Icon }: { label: string; value: string; icon: IconType }) => {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-x-4">
        <IconContainer icon={Icon} size="xl" />
        <div>
          <div className="text-foreground max-w-full truncate overflow-hidden text-xl font-semibold">{value}</div>
          <div className="text-muted-foreground text-sm">{label}</div>
        </div>
      </div>
    </Card>
  )
}

export function StatsCardSkeleton() {
  return (
    <Skeleton className="space-y-2 p-5">
      <div className="space-y-3">
        <SkeletonContent className="h-[12px] w-1/4" />
        <SkeletonContent className="h-[24px] w-1/2" />
      </div>
      <SkeletonContent className="h-[16px] w-1/3" />
    </Skeleton>
  )
}
