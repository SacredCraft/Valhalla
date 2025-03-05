import { createContext } from 'react'

import { ItemEditorContextType } from './types'

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
