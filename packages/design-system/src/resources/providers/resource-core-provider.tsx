import { createContext } from '@valhalla/design-system/utils/context'

const [ResourceCoreProvider, useResourceCore] = createContext<
  | {
      resourceName: string
      resourceFolder: string
      filePath: string
      fileName: string
    }
  | undefined
>(undefined)

const ResourceCoreContext = ({
  resourceName,
  resourceFolder,
  filePath,
  fileName,
  children,
}: {
  resourceName: string
  resourceFolder: string
  filePath: string
  fileName: string
  children: React.ReactNode
}) => {
  return (
    <ResourceCoreProvider
      value={{ resourceName, resourceFolder, filePath, fileName }}
    >
      {children}
    </ResourceCoreProvider>
  )
}

export { ResourceCoreContext, useResourceCore }
