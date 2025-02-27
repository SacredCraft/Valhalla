import { useEffect, useState } from 'react'
import yaml from 'yaml'

import { useResourceContent } from '@valhalla/design-system/resources/providers/resource-content-provider'

import { columns } from './columns'
import { ItemConfig, ItemEditorContext, ItemEditorExtra } from './context'
import { DataTable } from './data-table'
import { ItemDetailsEditor } from './editor'
import { useCurrentItem } from './hooks'

export default function ItemEditorLayout() {
  const {
    resourceContent: { data: resourceContent },
  } = useResourceContent({
    encoding: 'utf-8',
  }) as {
    resourceContent: { data: string; isLoading: boolean }
  }
  const [parsedContent, setParsedContent] = useState<ItemConfig | null>(null)
  const { currentItem, setCurrentItem, index, setIndex, saveCurrentItem } =
    useCurrentItem({ parsedContent, setParsedContent })
  const [extra, setExtra] = useState<ItemEditorExtra>({
    files: {},
  })

  useEffect(() => {
    if (resourceContent) {
      try {
        const parsedContent = yaml.parse(resourceContent)
        setParsedContent(parsedContent)
      } catch (error) {
        console.error('YAML parsing error:', error)
      }
    }
  }, [resourceContent])

  return (
    <ItemEditorContext.Provider
      value={{
        currentItem,
        setCurrentItem,
        parsedContent,
        setParsedContent,
        index,
        setIndex,
        saveCurrentItem,
        extra,
        setExtra,
      }}
    >
      <div className="flex h-full">
        {parsedContent && (
          <DataTable columns={columns} data={Object.values(parsedContent)} />
        )}
        <ItemDetailsEditor item={currentItem} />
      </div>
    </ItemEditorContext.Provider>
  )
}
