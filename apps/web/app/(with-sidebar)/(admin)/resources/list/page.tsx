import {
  GridSwitcher,
  GridSwitcherProvider,
} from './components/actions/grid-switcher'
import { NewResourceAction } from './components/actions/new'
import { ResourcesContent } from './components/resources/content'

export default function ResourcesListPage() {
  return (
    <GridSwitcherProvider>
      <div className="flex flex-col gap-2 @container">
        <ResourcesActions>
          <NewResourceAction />
          <GridSwitcher />
        </ResourcesActions>
        <ResourcesContent />
      </div>
    </GridSwitcherProvider>
  )
}

const ResourcesActions = ({ children }: { children?: React.ReactNode }) => {
  return <div className="flex items-center gap-4">{children}</div>
}
