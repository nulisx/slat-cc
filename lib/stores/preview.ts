import { create } from 'zustand'
import type { Biolink } from '@/lib/data/biolink/schemas'

type BiolinkPreview = {
  biolink?: Biolink
  setBiolink: (values: Biolink) => void
}

export const usePreview = create<BiolinkPreview>((set) => ({
  biolink: undefined,
  setBiolink: (values) => {
    set((state) => {
      return {
        biolink: {
          ...state.biolink,
          ...values,
        },
      }
    })
  },
}))
