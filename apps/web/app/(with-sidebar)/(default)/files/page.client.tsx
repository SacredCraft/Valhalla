'use client'

import { ScrollArea } from '@valhalla/design-system/components/ui/scroll-area'

import { orpc } from '@/lib/orpc/react'
import { useFileTabsStore } from '@/providers/file-tabs-provider'
import { FileTabsStore } from '@/store/file-tabs'

import { ContentLayout } from './components/content-layout'
import { Tabs } from './components/tabs'
import { useTabs } from './hooks/use-tabs'

const getResourceParams = (
  currentTab: FileTabsStore['tabs'][number] | undefined
) => {
  if (!currentTab) {
    return undefined
  }

  return {
    resourceName: currentTab.resourceName,
    resourceFolder: currentTab.resourceFolder,
    filePath: currentTab.filePath,
    fileName: currentTab.fileName,
  }
}

export const FilesPageContent = () => {
  const { currentTabIndex, setCurrentTabIndex } = useTabs()
  const { tabs, setIsModified } = useFileTabsStore((state) => state)
  const currentTab = tabs?.[currentTabIndex]

  const resourceParams = getResourceParams(currentTab)

  const isModified = Boolean(currentTab?.isModified)

  const handleSetIsModified = (isModified: boolean) => {
    console.log('isModified', isModified)
    setIsModified(currentTabIndex, isModified)
  }

  return (
    <>
      <Tabs currentTab={currentTabIndex} setCurrentTab={setCurrentTabIndex} />
      <ScrollArea className="h-[calc(100svh-84px)]">
        {resourceParams && (
          <FilesPageContentInner
            resourceParams={resourceParams}
            isModified={isModified}
            setIsModified={handleSetIsModified}
          />
        )}
      </ScrollArea>
    </>
  )
}

const FilesPageContentInner = ({
  resourceParams,
  isModified,
  setIsModified,
}: {
  resourceParams: Parameters<typeof orpc.files.layout.useQuery>[0]
  isModified: boolean
  setIsModified: (isModified: boolean) => void
}) => {
  const { data: layout } = orpc.files.layout.useQuery(resourceParams)
  const { data: isFileExist } = orpc.files.exist.useQuery(resourceParams)

  return layout !== undefined && isFileExist !== undefined ? (
    <ContentLayout
      data={layout.matchLayout}
      isFileExist={isFileExist}
      resourceParams={resourceParams}
      isModified={isModified}
      setIsModified={setIsModified}
    />
  ) : null
}
