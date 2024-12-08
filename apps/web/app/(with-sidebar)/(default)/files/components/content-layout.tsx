'use client'

import { Suspense } from 'react'

import { Layout } from '@valhalla/core/schema/layout'
import { ResourceCoreContext } from '@valhalla/design-system/resources/providers/resource-core-provider'

import { Components } from '@/__cache__/components'
import { NotFoundFileState, NotFoundLayoutState } from '@/components/states'
import { orpc } from '@/lib/orpc/react'

export const ContentLayout = ({
  data,
  isFileExist,
  resourceParams,
}: {
  data: Layout | null | undefined
  isFileExist: boolean
  resourceParams: Parameters<typeof orpc.files.layout.useQuery>[0]
}) => {
  if (!isFileExist) {
    return <NotFoundFileState />
  }

  if (!data || !data.component) {
    return <NotFoundLayoutState />
  }

  const Comp = Components[data.component]

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ResourceCoreContext
        resourceName={resourceParams.resourceName}
        resourceFolder={resourceParams.resourceFolder}
        filePath={resourceParams.filePath}
        fileName={resourceParams.fileName}
      >
        {Comp ? <Comp.default /> : null}
      </ResourceCoreContext>
    </Suspense>
  )
}
