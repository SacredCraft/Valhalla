import { useContext, useEffect, useState } from 'react'

import { Item } from './columns'
import { ItemConfig, ItemEditorContext } from './context'

export const useCurrentItem = ({
  parsedContent,
}: {
  parsedContent: ItemConfig | null
}) => {
  const [index, setIndex] = useState<number>(-1)
  const [currentItem, setCurrentItem] = useState<Item | null>(null)

  useEffect(() => {
    // 如果 index 变化，则更新 currentItem
    if (
      parsedContent &&
      index >= 0 &&
      index < Object.keys(parsedContent).length
    ) {
      setCurrentItem(parsedContent[Object.keys(parsedContent)[index]])
    }
  }, [parsedContent, index])

  useEffect(() => {
    // 如果 currentItem 变化，则更新 index
    if (parsedContent && currentItem) {
      setIndex(Object.keys(parsedContent).indexOf(currentItem.name))
    }
  }, [parsedContent, currentItem])

  const saveCurrentItem = () => {
    if (parsedContent && currentItem) {
      parsedContent[currentItem.name] = currentItem
    }
  }

  return { currentItem, setCurrentItem, index, setIndex, saveCurrentItem }
}

export const useItemEditor = () => {
  return useContext(ItemEditorContext)
}
