'use client'

import { parseAsInteger, useQueryState } from 'nuqs'

import { orpc } from '@/lib/orpc/react'
import { useFileTabsStore } from '@/providers/file-tabs-provider'

import { ContentLayout } from './components/content-layout'
import { Tabs } from './components/tabs'

export const FilesPageContent = () => {
  const [currentTabIndex, setCurrentTabIndex] = useQueryState(
    'tab',
    parseAsInteger.withDefault(0)
  )
  const { tabs } = useFileTabsStore((state) => state)
  const currentTab = tabs[currentTabIndex]
  const { data } = orpc.resources.layout.useQuery({
    resourceName: currentTab?.resourceName,
    resourceFolder: currentTab?.resourceFolder,
    filePath: currentTab?.filePath,
    fileName: currentTab?.fileName,
  })

  return (
    <>
      <Tabs currentTab={currentTabIndex} setCurrentTab={setCurrentTabIndex} />
      <ContentLayout data={data} />
    </>
  )
}
