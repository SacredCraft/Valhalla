'use client'

import { useRef, useState } from 'react'
import { Loader2, Upload, User } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@valhalla/design-system/components/ui/avatar'
import { Button } from '@valhalla/design-system/components/ui/button'
import { createContext } from '@valhalla/design-system/components/ui/context'
import { Input } from '@valhalla/design-system/components/ui/input'
import { cn } from '@valhalla/design-system/components/ui/src/utils/cn'

const AvatarUploader = ({
  src: initialSrc = null,
  avatar = null,
  setAvatar = () => {},
  onUpload = async () => true,
  isUploading = false,
  setIsUploading = () => {},
  children,
  className,
  ...props
}: {
  src?: string | null
  avatar?: File | null
  setAvatar?: (avatar: File) => void
  onUpload?: (file: File) => Promise<boolean>
  isUploading?: boolean
  setIsUploading?: (isUploading: boolean) => void
} & React.ComponentProps<'div'>) => {
  const [src, setSrc] = useState<string | null>(initialSrc)
  const [isDragging, setIsDragging] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleUpload = async (file: File): Promise<boolean> => {
    setIsUploading(true)
    return await onUpload(file)
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      handleUpload(file).then((success) => {
        const src = e.target?.result as string
        if (success) {
          setAvatar(file)
          setSrc(src)
        }
        setIsUploading(false)
      })
    }
    reader.readAsDataURL(file)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <AvatarUploaderProvider
      value={{ avatar, setAvatar, handleUpload, isUploading, src, setSrc }}
    >
      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          `flex flex-col items-center space-y-4 rounded-lg border-2 border-dashed p-8 transition-colors`,
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-muted-foreground/25',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AvatarUploaderProvider>
  )
}

const AvatarUploaderDisplay = (props: React.ComponentProps<typeof Avatar>) => {
  const { src, isUploading } = useAvatarUploaderContext()

  const avatarSrc = isUploading ? undefined : src || undefined

  return (
    <Avatar className="size-32" {...props}>
      <AvatarImage src={avatarSrc} alt="User avatar" />
      <AvatarFallback>
        {isUploading ? (
          <Loader2 className="size-16 animate-spin" />
        ) : (
          <User className="size-16" />
        )}
      </AvatarFallback>
    </Avatar>
  )
}

const AvatarUploaderButton = ({
  fullArea = false,
  children,
  accept = 'image/*',
  ...props
}: React.ComponentProps<typeof Button> & {
  fullArea?: boolean
  limitSize?: number
  accept?: string
}) => {
  const { isUploading, handleUpload } = useAvatarUploaderContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  return (
    <>
      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {!fullArea ? (
        <Button onClick={handleButtonClick} disabled={isUploading} {...props}>
          <Upload className="mr-2 size-4" />
          {children}
        </Button>
      ) : (
        <div
          onClick={handleButtonClick}
          className="absolute inset-0 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="上传头像"
        />
      )}
    </>
  )
}

const AvatarUploaderDescription = ({
  children,
  ...props
}: React.ComponentProps<'p'>) => {
  return (
    <p className="text-sm text-muted-foreground" {...props}>
      {children}
    </p>
  )
}

interface AvatarUploaderContextValue {
  src: string | null
  setSrc: (src: string) => void
  avatar: File | null
  setAvatar: (avatar: File) => void
  handleUpload: (file: File) => Promise<boolean>
  isUploading: boolean
}

const [AvatarUploaderProvider, useAvatarUploaderContext] =
  createContext<AvatarUploaderContextValue>({
    src: null,
    setSrc: () => {},
    avatar: null,
    setAvatar: () => {},
    handleUpload: async () => true,
    isUploading: false,
  })

export {
  AvatarUploader,
  AvatarUploaderDisplay,
  AvatarUploaderButton,
  AvatarUploaderDescription,
}

export { useAvatarUploaderContext }
