import { createContext } from '@valhalla/design-system/utils/context'

const [ResourceCoreProvider, useResourceCore] = createContext<
  | {
      resourceName: string
      resourceFolder: string
      filePath: string
      fileName: string
      isModified: boolean
      setIsModified: (isModified: boolean) => void
    }
  | undefined
>(undefined)

const ResourceCoreContext = ({
  resourceName,
  resourceFolder,
  filePath,
  fileName,
  isModified,
  setIsModified,
  children,
}: {
  resourceName: string
  resourceFolder: string
  filePath: string
  fileName: string
  isModified: boolean
  setIsModified: (isModified: boolean) => void
  children: React.ReactNode
}) => {
  return (
    <ResourceCoreProvider
      value={{
        resourceName,
        resourceFolder,
        filePath,
        fileName,
        isModified,
        setIsModified,
      }}
    >
      {children}
    </ResourceCoreProvider>
  )
}

export { ResourceCoreContext, useResourceCore }
