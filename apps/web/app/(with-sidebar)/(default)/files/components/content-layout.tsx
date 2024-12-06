'use client'

import { Suspense } from 'react'
import { parseAsInteger, useQueryState } from 'nuqs'

import { Components } from '@/__cache__/components'
import { orpc } from '@/lib/orpc/react'
import { useFileTabsStore } from '@/providers/file-tabs-provider'

export const ContentLayout = () => {
  const [currentTabIndex] = useQueryState('tab', parseAsInteger.withDefault(0))
  const { tabs } = useFileTabsStore((state) => state)
  const currentTab = tabs[currentTabIndex]
  const { data } = orpc.resources.layout.useQuery({
    resourceName: currentTab?.resourceName,
    resourceFolder: currentTab?.resourceFolder,
    filePath: currentTab?.filePath,
    fileName: currentTab?.fileName,
  })

  const Comp = Components[data?.component ?? '']

  return (
    <Suspense fallback={<div>加载中...</div>}>
      {Comp ? <Comp.default /> : null}
    </Suspense>
  )
}
