'use client'

import { orpc } from '@valhalla/api/react'
import { Resource } from '@valhalla/core/schema/resource'
import { TabsContent } from '@valhalla/design-system/components/ui/tabs'

import {
  ResourcesGridItem,
  ResourcesGridItemSkeleton,
  ResourcesListItem,
  ResourcesListItemSkeleton,
} from './item'

export const ResourcesContent = () => {
  const { data, isLoading } = orpc.resources.list.useQuery({})

  return (
    <>
      <TabsContent value="grid">
        <ResourcesGrid data={data} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="list">
        <ResourcesList data={data} isLoading={isLoading} />
      </TabsContent>
    </>
  )
}

type ResourcesProps = {
  data?: Resource[]
  isLoading: boolean
}

export const ResourcesGrid = ({ data, isLoading }: ResourcesProps) => {
  const resources = data ?? []
  return (
    <div className="grid grid-cols-1 gap-2 @[320px]:grid-cols-2 @[768px]:grid-cols-3 @[1024px]:grid-cols-4">
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <ResourcesGridItemSkeleton key={index} />
          ))
        : resources.map((resource) => (
            <ResourcesGridItem key={resource.name} {...resource} />
          ))}
    </div>
  )
}

export const ResourcesList = ({ data, isLoading }: ResourcesProps) => {
  const resources = Object.values(data ?? {})
  return (
    <div className="flex flex-col gap-2">
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <ResourcesListItemSkeleton key={index} />
          ))
        : resources.map((resource) => (
            <ResourcesListItem key={resource.name} {...resource} />
          ))}
    </div>
  )
}
