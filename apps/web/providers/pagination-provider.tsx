// src/providers/counter-store-provider.tsx
'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'

import { createPaginationStore, type PaginationStore } from '@/store/pagination'

export type PaginationStoreApi = ReturnType<typeof createPaginationStore>

export const PaginationStoreContext = createContext<
  PaginationStoreApi | undefined
>(undefined)

export const PaginationStoreProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const storeRef = useRef<PaginationStoreApi>(createPaginationStore())

  return (
    <PaginationStoreContext.Provider value={storeRef.current}>
      {children}
    </PaginationStoreContext.Provider>
  )
}

export const usePaginationStore = <T,>(
  selector: (store: PaginationStore) => T
): T => {
  const paginationStoreContext = useContext(PaginationStoreContext)

  if (!paginationStoreContext) {
    throw new Error(
      `usePaginationStore must be used within PaginationStoreProvider`
    )
  }

  return useStore(paginationStoreContext, selector)
}
