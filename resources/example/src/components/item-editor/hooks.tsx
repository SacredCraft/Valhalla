import { useContext, useState } from 'react'
import yaml from 'yaml'

import { orpc } from '@valhalla/api/react'
import { toast } from '@valhalla/design-system/components/ui/sonner'
import { useResourceContent } from '@valhalla/design-system/resources/providers/resource-content-provider'

import { ItemEditorContext } from './context'
import { Item, ItemConfig, ItemWithId } from './types'

export const useCurrentItem = ({
  parsedContent,
  setParsedContent,
}: {
  parsedContent: ItemConfig | null
  setParsedContent: (parsedContent: ItemConfig) => void
}) => {
  const { saveResourceContent } = useResourceContent()
  const [currentItem, setCurrentItem] = useState<ItemWithId | null>(null)
  const utils = orpc.useUtils()

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

      toast.promise(saveResourceContent(yaml.stringify(newParsedContent)), {
        loading: '保存中...',
        success: () => {
          utils.files.read.invalidate()
          return '保存成功'
        },
        error: '保存失败',
      })
    }
  }

  return { currentItem, setCurrentItem, saveCurrentItem }
}

export const useItemEditor = () => {
  return useContext(ItemEditorContext)
}
