import { useCallback } from 'react'

import { orpc } from '@valhalla/api/react'

import { useResourceCore } from './resource-core-provider'

export function useResourceContent(
  readFileOptions?: Parameters<
    typeof orpc.files.read.useQuery
  >[0]['readFileOptions']
) {
  const { resourceName, resourceFolder, filePath, fileName, setIsModified } =
    useResourceCore()

  const resourceContent = orpc.files.read.useQuery({
    resourceName,
    resourceFolder,
    filePath,
    fileName,
    readFileOptions,
  })

  const { mutate: saveResourceContent } = orpc.files.save.useMutation()
  const handleSaveResourceContent = useCallback(
    (content: string) => {
      return new Promise<void>((resolve, reject) => {
        saveResourceContent(
          {
            resourceName,
            resourceFolder,
            filePath,
            fileName,
            data: content,
          },
          {
            onSuccess: () => {
              resolve()
              setIsModified(false)
            },
            onError: (error) => reject(error),
          }
        )
      })
    },
    [saveResourceContent, resourceName, resourceFolder, filePath, fileName]
  )

  return {
    resourceContent,
    saveResourceContent: handleSaveResourceContent,
  }
}
