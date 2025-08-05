'use client'

import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { AnimatedEmptyState } from '@/components/animated-empty-state'
import { SortableItem } from '@/components/sortable-item'
import { Alert } from '@/components/ui/alert'
import { Icons } from '@/lib/constants/icons'
import type { Biolink } from '@/lib/data/biolink/schemas'
import { reorderEmbeds } from '@/lib/data/embeds/actions'
import type { Embed } from '@/lib/data/embeds/schemas'
import { useSortableList } from '@/lib/hooks/use-sortable-list'
import { EmbedItem } from './_components/embed-item'

export default function WidgetsClient({ biolink, embeds }: { biolink: Biolink; embeds: Embed[] }) {
  const { items, setItems, activeId, sensors, handleDragStart, handleDragEnd } = useSortableList(embeds, reorderEmbeds)

  const remove = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <>
      {items.length === 0 ? (
        <AnimatedEmptyState
          title="No Widgets Found"
          description="Widgets are a great way to add dynamic content and integrate your other platforms to your page."
          cardContent={
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="bg-accent relative grid size-9 place-content-center rounded-lg">
                  <div className="absolute right-0 bottom-0 z-10 size-2 rounded-full bg-green-500">
                    <div className="absolute size-2 animate-ping rounded-full bg-green-500" />
                  </div>
                  <Icons.user className="text-muted-foreground size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="bg-accent h-3 w-12 rounded-sm" />
                  <div className="bg-accent h-3 w-24 rounded-sm" />
                </div>
              </div>
            </div>
          }
        />
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id.toString()}>
                  <EmbedItem biolink={biolink} embed={item} onRemove={remove} />
                </SortableItem>
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId &&
                (() => {
                  const activeItem = items.find((item) => item.id.toString() === activeId)
                  if (!activeItem) return null

                  return (
                    <SortableItem key={activeItem.id} id={activeItem.id.toString()}>
                      <EmbedItem biolink={biolink} embed={activeItem} onRemove={remove} />
                    </SortableItem>
                  )
                })()}
            </DragOverlay>
          </DndContext>
          <Alert variant="info" title="When Do Embeds Update?" className="mb-4">
            Some embeds are cached for speed and may take up to an hour to update. More active ones refresh more often.
          </Alert>
        </>
      )}
    </>
  )
}
