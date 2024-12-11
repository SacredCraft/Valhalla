import Image from 'next/image'
import { DownloadIcon } from 'lucide-react'

import { Button } from '@valhalla/design-system/components/ui/button'
import {
  ResourceContentContext,
  useResourceContent,
} from '@valhalla/design-system/resources/providers/resource-content-provider'
import { useResourceCore } from '@valhalla/design-system/resources/providers/resource-core-provider'

export default function ImagePreview() {
  return (
    <ResourceContentContext>
      <ImagePreviewInner />
    </ResourceContentContext>
  )
}

const ImagePreviewInner = () => {
  const {
    resourceContent: { data },
  } = useResourceContent() as {
    resourceContent: { data: Buffer | undefined | null }
  }

  if (!data) return null

  const imageUrl = `data:image/png;base64,${Buffer.from(data).toString(
    'base64'
  )}`

  return (
    <div className="flex flex-col h-full items-center justify-center relative">
      <Image
        src={imageUrl}
        className="h-fit w-fit"
        alt="Preview"
        width={0}
        height={0}
      />
      <ToolBar data={data} />
    </div>
  )
}

const ToolBar = ({ data }: { data: Buffer }) => {
  const { fileName } = useResourceCore()

  const getMimeType = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop() || ''
    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      bmp: 'image/bmp',
    }
    return mimeTypes[ext] || 'image/png' // 默认返回 png
  }

  const handleDownload = async () => {
    if (!data) return

    const base64Data = Buffer.from(data).toString('base64')
    const binaryData = atob(base64Data)

    const bytes = new Uint8Array(binaryData.length)
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i)
    }

    // 根据文件名获取正确的 MIME 类型
    const mimeType = getMimeType(fileName || '')
    const blob = new Blob([bytes], { type: mimeType })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName || 'image.png'

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="absolute bottom-8 w-full flex justify-center items-center pointer-events-none">
      <div className="mx-auto flex items-center gap-2 bg-accent p-2 rounded-lg pointer-events-auto">
        <Button variant="outline" size="icon" onClick={handleDownload}>
          <DownloadIcon />
        </Button>
      </div>
    </div>
  )
}
