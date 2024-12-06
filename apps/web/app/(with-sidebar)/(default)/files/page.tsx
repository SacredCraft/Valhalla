import { getResources } from '@valhalla/api/router/resources'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@valhalla/design-system/components/ui/resizable'

import { Layout, Resource, Tabs, ValResourcePanel } from './page.client'

export default async function FilesPage() {
  return (
    <ResizablePanelGroup direction="horizontal" className="border border-x-0">
      <ValResourcePanel defaultSize={20} maxSize={30}>
        <Resources />
      </ValResourcePanel>
      <ResizableHandle className="transition-colors hover:w-1 hover:bg-primary/30" />
      <ResizablePanel className="flex flex-col" defaultSize={80}>
        <Tabs />
        <Layout />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

const Resources = async () => {
  const resources = await getResources(undefined)
  return (
    <div className="flex flex-col items-center justify-center">
      {Object.entries(resources).map(([key, resource]) => (
        <Resource
          key={key}
          name={resource.name}
          description={resource.description}
          label={resource.label}
        />
      ))}
    </div>
  )
}
