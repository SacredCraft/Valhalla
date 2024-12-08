'use client'

import { Suspense } from 'react'

import { Layout } from '@valhalla/core/schema/layout'

import { Components } from '@/__cache__/components'
import { NotFoundFileState, NotFoundLayoutState } from '@/components/states'

export const ContentLayout = ({
  data,
  isFileExist,
}: {
  data: Layout | null | undefined
  isFileExist: boolean
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
      {Comp ? <Comp.default /> : null}
    </Suspense>
  )
}
