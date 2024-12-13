import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import { storage } from './shared'

export interface PaginationStore {
  pagination: {
    name: string
    pageSize: number
  }[]

  setPagination: (name: string, pageSize: number) => void
}

export const createPaginationStore = () =>
  createStore<PaginationStore>()(
    persist(
      (set, get) => ({
        pagination: [],
        setPagination: (name: string, pageSize: number) => {
          set({
            pagination: get().pagination.some((item) => item.name === name)
              ? get().pagination.map((item) =>
                  item.name === name ? { ...item, pageSize } : item
                )
              : [...get().pagination, { name, pageSize }],
          })
        },
      }),
      {
        name: 'pagination',
        storage: createJSONStorage(() => storage),
      }
    )
  )
