import { Skeleton, SkeletonContent } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        {new Array(8).fill(null).map((_, idx) => (
          <Skeleton key={idx} className="h-10 w-20" />
        ))}
      </div>
      {[...Array(5)].map((_, idx) => (
        <Skeleton key={idx} className="flex w-full items-center gap-x-4 p-6">
          <SkeletonContent className="size-9 shrink-0 rounded-xl" />
          <div className="w-full space-y-2">
            <SkeletonContent className="h-4 w-1/5" />
            <SkeletonContent className="h-3 w-1/3" />
          </div>
        </Skeleton>
      ))}
    </div>
  )
}
