'use client'

import Link from 'next/link'
import * as React from 'react'

import { Embed } from '@/components/biolink/embeds/embed'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Icons } from '@/lib/constants/icons'
import { paths } from '@/lib/constants/paths'
import type { Biolink } from '@/lib/data/biolink/schemas'
import { deleteEmbed } from '@/lib/data/embeds/actions'
import type { Embed as EmbedType } from '@/lib/data/embeds/schemas'
import { useServerAction } from '@/lib/hooks/use-server-action'
import { cn } from '@/lib/utils'

export function EmbedItem({
  embed,
  biolink,
  onRemove,
}: {
  embed: EmbedType
  biolink: Biolink
  onRemove: (id: number) => void
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const { run, loading } = useServerAction(deleteEmbed, {
    toast: {
      success: 'Embed removed successfully',
    },
  })

  const remove = async () => {
    await run(embed.id)
    setDeleteDialogOpen(false)
    onRemove(embed.id)
  }

  return (
    <>
      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={remove}
        title="Remove Embed"
        description="Are you sure you want to remove this embed?"
        variant="destructive"
      />
      <div className="flex w-full gap-4 p-4">
        <div className="flex flex-col items-center justify-center gap-1">
          <Link
            href={`${paths.dashboard.customize.widgets}/${embed.id}`}
            className={cn(buttonVariants({ variant: 'action', size: 'icon-sm' }))}
          >
            <Icons.pencil className="size-3.5" />
          </Link>
          <Button disabled={loading} onClick={() => setDeleteDialogOpen(true)} variant="destructive" size="icon-sm">
            <Icons.trash className="size-3.5" />
          </Button>
        </div>
        <Embed
          embed={embed}
          card={biolink.card}
          container={biolink.container}
          colors={{
            text: biolink.textColor,
            theme: biolink.themeColor,
            name: biolink.nameColor,
          }}
          preview
        />
      </div>
    </>
  )
}
