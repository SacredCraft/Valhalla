import { del, get, set } from 'idb-keyval'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name)
  },
}

export interface FileTabsStore {
  tabs: {
    fileName: string
    filePath: string
    resourceName: string
    resourceFolder: string
    isModified: boolean
  }[]

  addTab: (tab: {
    fileName: string
    filePath: string
    resourceName: string
    resourceFolder: string
    currentTabIndex: number
  }) => number
  removeTab: (index: number) => void
  removeOtherTabs: (index: number) => void
  removeAllTabs: () => void
}

export const createFileTabsStore = () =>
  createStore<FileTabsStore>()(
    persist(
      (set, get) => ({
        tabs: [],
        addTab: (tab: {
          fileName: string
          filePath: string
          resourceName: string
          resourceFolder: string
          currentTabIndex: number
        }) => {
          const existingTabIndex = get().tabs.findIndex(
            (t) =>
              t.filePath === tab.filePath &&
              t.fileName === tab.fileName &&
              t.resourceName === tab.resourceName &&
              t.resourceFolder === tab.resourceFolder
          )
          if (existingTabIndex === -1) {
            const newTabs = [
              ...get().tabs.slice(0, tab.currentTabIndex + 1),
              {
                ...tab,
                isModified: false,
              },
              ...get().tabs.slice(tab.currentTabIndex + 1),
            ]
            set({ tabs: newTabs })
            return tab.currentTabIndex + 1
          }
          return existingTabIndex
        },
        removeTab: (index: number) => {
          set({ tabs: get().tabs.filter((_, i) => i !== index) })
        },
        removeOtherTabs: (index: number) => {
          set({
            tabs: get().tabs.filter((_, i) => i === index),
          })
        },
        removeAllTabs: () => {
          set({ tabs: [] })
        },
      }),
      {
        name: 'file-tabs',
        storage: createJSONStorage(() => storage),
      }
    )
  )
