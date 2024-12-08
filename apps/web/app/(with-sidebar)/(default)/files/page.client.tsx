'use client'

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
  const { tabs } = useFileTabsStore((state) => state)
  const currentTab = tabs[currentTabIndex]

  const resourceParams = getResourceParams(currentTab)

  return (
    <>
      <Tabs currentTab={currentTabIndex} setCurrentTab={setCurrentTabIndex} />
      {resourceParams && (
        <FilesPageContentInner resourceParams={resourceParams} />
      )}
    </>
  )
}

const FilesPageContentInner = ({
  resourceParams,
}: {
  resourceParams: Parameters<typeof orpc.files.layout.useQuery>[0]
}) => {
  const { data: layout } = orpc.files.layout.useQuery(resourceParams)
  const { data: isFileExist } = orpc.files.exist.useQuery(resourceParams)

  return layout !== undefined && isFileExist !== undefined ? (
    <ContentLayout
      data={layout}
      isFileExist={isFileExist}
      resourceParams={resourceParams}
    />
  ) : null
}
