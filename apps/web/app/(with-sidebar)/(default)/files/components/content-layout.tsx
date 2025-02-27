'use client'

import { Suspense } from 'react'

import { Layout } from '@valhalla/core/schema/layout'
import { ResourceCoreContext } from '@valhalla/design-system/resources/providers/resource-core-provider'

import { Components } from '@/__cache__/components'
import {
  LoadingState,
  NotFoundFileState,
  NotFoundLayoutState,
} from '@/components/states'
import { orpc } from '@/lib/orpc/react'

export const ContentLayout = ({
  data,
  isFileExist,
  resourceParams,
  isModified,
  setIsModified,
}: {
  data: Layout | null | undefined
  isFileExist: boolean
  resourceParams: Parameters<typeof orpc.files.layout.useQuery>[0]
  isModified: boolean
  setIsModified: (isModified: boolean) => void
}) => {
  if (!isFileExist) {
    return <NotFoundFileState />
  }

  if (!data || !data.component) {
    return <NotFoundLayoutState />
  }

  const Comp = Components[data.component]

  return (
    <Suspense fallback={<LoadingState className="h-[calc(100svh-84px)]" />}>
      <ResourceCoreContext
        resourceName={resourceParams.resourceName}
        resourceFolder={resourceParams.resourceFolder}
        filePath={resourceParams.filePath}
        fileName={resourceParams.fileName}
        isModified={isModified}
        setIsModified={setIsModified}
      >
        {Comp ? <Comp.default /> : null}
      </ResourceCoreContext>
    </Suspense>
  )
}
