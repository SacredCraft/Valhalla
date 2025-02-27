import { createContext } from 'react'

import { ItemConfig, ItemEditorContextType, ItemEditorExtra } from './types'

export const ItemEditorContext = createContext<ItemEditorContextType>({
  currentItem: null,
  setCurrentItem: () => {},
  parsedContent: null,
  setParsedContent: () => {},
  saveCurrentItem: () => {},
  extra: {
    files: {},
  },
  setExtra: () => {},
})
