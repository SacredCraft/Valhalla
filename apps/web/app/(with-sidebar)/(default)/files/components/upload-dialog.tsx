import { useState } from 'react'

import { orpc } from '@valhalla/api/react'
import { Button } from '@valhalla/design-system/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@valhalla/design-system/components/ui/dialog'

import { FileUploader } from '@/components/file-uploader'
import { formatBytes } from '@/lib/utils'

const MAX_FILE_SIZE = 1024 * 1024 * 10 // 10MB
const MAX_FILE_COUNT = 10
const MAX_CONCURRENT_UPLOADS = 3

export function UploadDialog({
  resourceName,
  resourceFolder,
  filePath,
  children,
}: {
  resourceName: string
  resourceFolder: string
  filePath: string
  children: React.ReactNode
}) {
  const [_, setFiles] = useState<File[]>([])
  const [progresses, setProgresses] = useState<Record<string, number>>({})
  const utils = orpc.useUtils()

  const handleUpload = async (files: File[]) => {
    setFiles(files)
    setProgresses(files.reduce((acc, file) => ({ ...acc, [file.name]: 0 }), {}))

    const uploadFile = async (file: File) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('resourceName', resourceName)
        formData.append('resourceFolder', resourceFolder)
        formData.append('targetPath', filePath)

        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded * 100) / event.total)
            setProgresses((prev) => ({
              ...prev,
              [file.name]: percentage,
            }))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            console.log(`${file.name} 上传成功`)
            resolve(file)
          } else {
            console.error(`${file.name} 上传失败`)
            reject(new Error(`上传失败: ${xhr.status}`))
          }
        })

        xhr.open('POST', '/api/files/upload')
        xhr.send(formData)
      })
    }

    // 分批上传文件
    for (let i = 0; i < files.length; i += MAX_CONCURRENT_UPLOADS) {
      const batch = files.slice(i, i + MAX_CONCURRENT_UPLOADS)
      await Promise.all(batch.map(uploadFile))
    }

    await utils.files.invalidate()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>上传文件</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          文件大小不能超过 {formatBytes(MAX_FILE_SIZE)}，文件数量不能超过
          {MAX_FILE_COUNT}。
        </DialogDescription>
        <FileUploader
          maxSize={MAX_FILE_SIZE}
          maxFileCount={MAX_FILE_COUNT}
          onUpload={handleUpload}
          progresses={progresses}
        />
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">关闭</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
