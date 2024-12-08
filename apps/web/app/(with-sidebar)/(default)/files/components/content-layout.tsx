'use client'

import { Suspense } from 'react'

import { Layout } from '@valhalla/core/schema/layout'

import { Components } from '@/__cache__/components'

export const ContentLayout = ({
  data,
}: {
  data: Layout | null | undefined
}) => {
  if (!data) {
    // TODO: 文件可能已被删除或重命名
    return null
  }

  const Comp = Components[data.component ?? '']

  return (
    <Suspense fallback={<div>加载中...</div>}>
      {Comp ? <Comp.default /> : null}
    </Suspense>
  )
}
