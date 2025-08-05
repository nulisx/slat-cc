import * as React from 'react'

import {
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { useServerAction } from '@/lib/hooks/use-server-action'

export function useSortableList<T extends { id: number }>(
  initialItems: T[],
  reorderAction: (items: T[]) => Promise<any>,
) {
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [items, setItems] = React.useState<T[]>(initialItems)
  const isLikelyDesktop = useMediaQuery('(min-width: 768px)')

  const { run, loading: ordering } = useServerAction(reorderAction, {
    toast: {
      loading: 'Reordering items...',
      success: 'Order updated successfully',
      error: 'Failed to update order',
    },
  })

  const sensors = useSensors(
    useSensor(isLikelyDesktop ? PointerSensor : TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id.toString())
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const reorderedItems = arrayMove(
        items,
        items.findIndex((item) => item.id.toString() === active.id.toString()),
        items.findIndex((item) => item.id.toString() === over.id.toString()),
      )

      setItems(reorderedItems)
      run(reorderedItems)
    }

    setActiveId(null)
  }

  return {
    items,
    setItems,
    activeId,
    ordering,
    sensors,
    handleDragStart,
    handleDragEnd,
  }
}
