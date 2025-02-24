import { createContext } from 'react'

import { Item } from './columns'

export type ItemConfig = {
  [key: string]: Item
}

export const ItemEditorContext = createContext<{
  currentItem: Item | null
  setCurrentItem: (item: Item | null) => void
  parsedContent: ItemConfig | null
  setParsedContent: (content: ItemConfig) => void
  index: number
  setIndex: (index: number) => void
  saveCurrentItem: () => void
}>({
  currentItem: null,
  setCurrentItem: () => {},
  parsedContent: null,
  setParsedContent: () => {},
  index: 0,
  setIndex: () => {},
  saveCurrentItem: () => {},
})
