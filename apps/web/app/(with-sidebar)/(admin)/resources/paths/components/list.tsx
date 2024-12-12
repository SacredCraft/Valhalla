'use client'

import { orpc } from '@/lib/orpc/react'

import { PathsItem, PathsItemSkeleton } from './item'

export const PathsList = () => {
  const { data } = orpc.paths.list.useQuery({})

  return (
    <div className="flex flex-col border-b">
      {data
        ? Object.entries(data).map(([resourceName, paths]) => (
            <PathsItem
              key={resourceName}
              resourceName={resourceName}
              paths={paths}
            />
          ))
        : Array.from({ length: 4 }).map((_, index) => (
            <PathsItemSkeleton key={index} />
          ))}
    </div>
  )
}
