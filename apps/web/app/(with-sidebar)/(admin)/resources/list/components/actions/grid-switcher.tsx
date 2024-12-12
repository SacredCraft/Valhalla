'use client'

import { Grid, List } from 'lucide-react'
import { useQueryState } from 'nuqs'

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@valhalla/design-system/components/ui/tabs'

export const GridSwitcherProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [view, setView] = useQueryState('view', {
    defaultValue: 'grid',
  })

  return (
    <Tabs value={view} onValueChange={setView}>
      {children}
    </Tabs>
  )
}

export const GridSwitcher = () => {
  return (
    <TabsList className="ml-auto h-8">
      <TabsTrigger className="px-2" value="grid">
        <Grid className="size-5" />
      </TabsTrigger>
      <TabsTrigger className="px-2 py-1" value="list">
        <List className="size-5" />
      </TabsTrigger>
    </TabsList>
  )
}
