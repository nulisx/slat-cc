'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ColorPicker } from '@/components/form/color-picker'
import { colorsFormSchema, type ColorsFormValues } from '@/lib/zod/schemas/biolink'
import { useSyncPreview } from '@/lib/hooks/use-sync-preview'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icons } from '@/lib/constants/icons'
import { useForm } from 'react-hook-form'
import { useServerAction } from '@/lib/hooks/use-server-action'
import { updateColors } from '@/lib/data/biolink/actions/update-colors'
import type { Biolink } from '@/lib/data/biolink/schemas'
import { CardFormWrapper } from '@/components/form/card-form-wrapper'

export function ColorsForm({ biolink }: { biolink: Biolink }) {
  const form = useForm<ColorsFormValues>({
    resolver: zodResolver(colorsFormSchema),
    defaultValues: {
      themeColor: biolink.themeColor,
      nameColor: biolink.nameColor,
      textColor: biolink.textColor,
    },
  })

  const { run, loading } = useServerAction(updateColors, {
    toast: {
      success: 'Colors updated successfully',
    },
  })

  const onSubmit = async (values: ColorsFormValues) => {
    await run(values)
  }

  useSyncPreview(form, (values, prev) => ({ ...prev, ...values }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardFormWrapper loading={loading} title="Colors" icon={Icons.paintBrush}>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="themeColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardFormWrapper>
      </form>
    </Form>
  )
}
