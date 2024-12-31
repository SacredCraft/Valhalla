import { orpc } from '@valhalla/api/react'

import { useResourceCore } from './resource-core-provider'

export function useResourceContent(
  readFileOptions?: Parameters<
    typeof orpc.files.read.useQuery
  >[0]['readFileOptions']
) {
  const { resourceName, resourceFolder, filePath, fileName } = useResourceCore()

  const resourceContent = orpc.files.read.useQuery({
    resourceName,
    resourceFolder,
    filePath,
    fileName,
    readFileOptions,
  })

  const saveResourceContent = orpc.files.save.useMutation()

  return {
    resourceContent,
    saveResourceContent,
  }
}
