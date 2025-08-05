import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/lib/constants/icons'
import { deleteComment, pinComment } from '@/lib/data/comments/actions'
import type { Comment } from '@/lib/data/comments/schemas'
import { useServerAction } from '@/lib/hooks/use-server-action'

export function CommentDropdown({
  comment,
  pinned,
  onPin,
  onDelete,
}: {
  comment: Comment
  pinned: boolean
  onPin: () => void
  onDelete: () => void
}) {
  const { run: _pin, loading: pinning } = useServerAction(pinComment, {
    toast: {
      success: pinned ? 'Comment unpinned' : 'Comment pinned',
    },
  })

  const { run: _remove, loading: removing } = useServerAction(deleteComment, {
    toast: {
      success: 'Comment deleted',
    },
  })

  const pin = async () => {
    await _pin(comment.id)

    onPin()
  }

  const remove = async () => {
    await _remove(comment.id)

    onDelete()
  }

  const loading = pinning || removing

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <Icons.moreHorizontal className="size-5 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={pin} disabled={loading}>
            <Icons.pin className="mr-2 h-4 w-4" />
            <span>{pinned ? 'Unpin' : 'Pin'}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/5" />
          <DropdownMenuItem onClick={remove} disabled={loading}>
            <Icons.trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
