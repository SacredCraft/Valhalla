import { getResources } from '@valhalla/api/router/resources'
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@valhalla/design-system/components/ui/resizable'

import { Resource } from './components/resource'
import { ValResourcePanel } from './components/val-resource-panel'
import { FilesPageContent } from './page.client'

export default async function FilesPage() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="relative border border-x-0 border-t-0"
    >
      <ValResourcePanel defaultSize={20} maxSize={30}>
        <Resources />
      </ValResourcePanel>
      <ResizablePanel className="flex flex-col" defaultSize={80}>
        <FilesPageContent />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

const Resources = async () => {
  const resources = await getResources({})
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
