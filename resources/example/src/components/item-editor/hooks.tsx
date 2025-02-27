import { useContext, useState } from 'react'

import { ItemEditorContext } from './context'
import { Item, ItemConfig, ItemWithId } from './types'

export const useCurrentItem = ({
  parsedContent,
  setParsedContent,
}: {
  parsedContent: ItemConfig | null
  setParsedContent: (parsedContent: ItemConfig) => void
}) => {
  const [currentItem, setCurrentItem] = useState<ItemWithId | null>(null)

  const saveCurrentItem = (newItem: Item & { id: string }) => {
    if (parsedContent && currentItem) {
      const newParsedContent = { ...parsedContent }
      if (newItem.id !== currentItem.id) {
        delete newParsedContent[currentItem.id]
      }
      const { id: _, ...itemWithoutId } = newItem
      newParsedContent[newItem.id] = itemWithoutId
      setParsedContent(newParsedContent)

      setCurrentItem({
        id: newItem.id,
        data: itemWithoutId,
      })
    }
  }

  return { currentItem, setCurrentItem, saveCurrentItem }
}

export const useItemEditor = () => {
  return useContext(ItemEditorContext)
}
