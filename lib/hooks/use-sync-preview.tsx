import type { Biolink } from '@/lib/data/biolink/schemas'
import { usePreview } from '@/lib/stores/preview'
import * as React from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

export function useSyncPreview<T extends FieldValues>(
  form: UseFormReturn<T>,
  merge: (values: Partial<T>, prev: Biolink) => Partial<Biolink>,
) {
  const { biolink, setBiolink } = usePreview()

  React.useEffect(() => {
    if (!biolink) return

    const subscription = form.watch((values) => {
      const next = merge(values, biolink)

      setBiolink({ ...biolink, ...next })
    })

    return () => subscription.unsubscribe()
  }, [form, form.watch, biolink, setBiolink, merge])
}
