import { createContext } from 'react'

import { Item } from './columns'

export type ItemConfig = {
  [key: string]: Item
}

export type ItemEditorExtra = {
  files: {
    [key: string]: File
  }
}

export const ItemEditorContext = createContext<{
  currentItem: Item | null
  setCurrentItem: (item: Item | null) => void
  parsedContent: ItemConfig | null
  setParsedContent: (content: ItemConfig) => void
  index: number
  setIndex: (index: number) => void
  saveCurrentItem: () => void
  extra: ItemEditorExtra
  setExtra: (extra: ItemEditorExtra) => void
}>({
  currentItem: null,
  setCurrentItem: () => {},
  parsedContent: null,
  setParsedContent: () => {},
  index: 0,
  setIndex: () => {},
  saveCurrentItem: () => {},
  extra: {
    files: {},
  },
  setExtra: () => {},
})
