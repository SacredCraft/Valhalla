import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'

import { orpc } from '@valhalla/api/react'
import { createContext } from '@valhalla/design-system/utils/context'

import { useResourceCore } from './resource-core-provider'

const [ResourceContentProvider, useResourceContent] = createContext<
  | {
      resourceContent: UseQueryResult<unknown>
      saveResourceContent: UseMutationResult<
        void,
        Error,
        Parameters<ReturnType<typeof orpc.files.save.useMutation>['mutate']>[0]
      >
    }
  | undefined
>(undefined)

const ResourceContentContext = ({
  children,
  readFileOptions,
}: {
  children: React.ReactNode
  readFileOptions?: Parameters<
    typeof orpc.files.read.useQuery
  >[0]['readFileOptions']
}) => {
  const { resourceName, resourceFolder, filePath, fileName } = useResourceCore()
  const resourceContent = orpc.files.read.useQuery({
    resourceName,
    resourceFolder,
    filePath,
    fileName,
    readFileOptions,
  })

  const saveResourceContent = orpc.files.save.useMutation()

  return (
    <ResourceContentProvider value={{ resourceContent, saveResourceContent }}>
      {children}
    </ResourceContentProvider>
  )
}

export { ResourceContentContext, useResourceContent }
