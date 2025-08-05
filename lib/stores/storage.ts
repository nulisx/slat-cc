import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type StorageStore = {
  colors: string[]
  removeColor: (color: string) => void
  addColor: (color: string) => void
}

export const useStorageStore = create(
  persist<StorageStore>(
    (set) => ({
      colors: ['#FF0000', '#00FF00'],
      removeColor: (color) =>
        set((state) => ({
          colors: state.colors.filter((c) => c !== color),
        })),
      addColor: (color) => set((state) => ({ colors: [...state.colors, color] })),
    }),
    {
      name: 'slat-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
