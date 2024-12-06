// src/providers/counter-store-provider.tsx
'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'

import { createFileTabsStore, type FileTabsStore } from '@/store/file-tabs'

export type FileTabsStoreApi = ReturnType<typeof createFileTabsStore>

export const FileTabsStoreContext = createContext<FileTabsStoreApi | undefined>(
  undefined
)

export const FileTabsStoreProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const storeRef = useRef<FileTabsStoreApi>(createFileTabsStore())

  return (
    <FileTabsStoreContext.Provider value={storeRef.current}>
      {children}
    </FileTabsStoreContext.Provider>
  )
}

export const useFileTabsStore = <T,>(
  selector: (store: FileTabsStore) => T
): T => {
  const fileTabsStoreContext = useContext(FileTabsStoreContext)

  if (!fileTabsStoreContext) {
    throw new Error(
      `useFileTabsStore must be used within FileTabsStoreProvider`
    )
  }

  return useStore(fileTabsStoreContext, selector)
}
