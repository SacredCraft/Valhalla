'use client'

import path from 'path'
import React, { Suspense } from 'react'
import { File, Folder, Info } from 'lucide-react'

import { Button } from '@valhalla/design-system/components/ui/button'
import { ResizablePanel } from '@valhalla/design-system/components/ui/resizable'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@valhalla/design-system/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@valhalla/design-system/components/ui/tooltip'
import { useIsMobile } from '@valhalla/design-system/hooks/use-mobile'

import { Components } from '@/__cache__/components'
import { Icons } from '@/components/icons'
import { orpc } from '@/lib/orpc/react'

import {
  CollapsibleFolder,
  useFolderContext,
} from './components/collapsible-folder'
import { FileContextMenu } from './components/context-menus'

export const Test = () => {
  const { data } = orpc.resources.layout.useQuery({})

  const Comp = Components[data?.menus[0].render ?? '']

  return (
    <Suspense fallback={<div>加载中...</div>}>
      {Comp ? <Comp.default /> : null}
    </Suspense>
  )
}

const ValResourcePanel = ({
  children,
  defaultSize = 20,
  maxSize = 30,
}: {
  children: React.ReactNode
  defaultSize?: number
  maxSize?: number
}) => {
  const isMobile = useIsMobile()
  return isMobile ? (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Folder className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="p-4 text-left">
          <SheetTitle>资源面板</SheetTitle>
          <SheetDescription>
            你可以在这里管理你的资源，包括文件和文件夹。
          </SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  ) : (
    <ResizablePanel defaultSize={defaultSize} maxSize={maxSize}>
      {children}
    </ResizablePanel>
  )
}

const Resource = ({
  name,
  description,
  label,
}: {
  name: string
  description?: string
  label?: string
}) => {
  return (
    <CollapsibleFolder
      contextMenu={false}
      folderIcon={false}
      trigger={
        <>
          {label || name}
          {description && (
            <ResourceDescription
              description={description}
              name={name}
              label={label}
            />
          )}
        </>
      }
    >
      <ResourceLinkedFolders name={name} />
    </CollapsibleFolder>
  )
}
const ResourceDescription = ({
  description,
  name,
  label,
}: {
  description?: string
  name: string
  label?: string
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="ml-auto size-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent side="bottom" className="flex flex-col gap-1">
        <p className="text-sm font-medium">资源: {label || name}</p>
        <p className="text-sm text-muted-foreground">描述: {description}</p>
      </TooltipContent>
    </Tooltip>
  )
}

const ResourceLinkedFolders = ({ name }: { name: string }) => {
  const { data } = orpc.resources.folders.useQuery({ name })
  return (
    <div className="flex flex-col gap-1">
      {data?.map((folder) => (
        <ResourceLinkedFolder
          key={folder.name}
          resourceFolder={folder.name}
          resourceName={name}
        />
      ))}
    </div>
  )
}

const ResourceLinkedFolder = ({
  resourceFolder,
  resourceName,
}: {
  resourceFolder: string
  resourceName: string
}) => {
  const { data } = orpc.files.list.useQuery({
    resourceName,
    resourceFolder,
    path: '',
  })

  return (
    <CollapsibleFolder linkIcon trigger={<>{resourceFolder}</>}>
      {data
        ?.filter((file) => file.isDirectory)
        .map((file) => (
          <ResourceFolder
            key={file.name}
            folderName={file.name}
            folderPath={file.name}
            resourceFolder={resourceFolder}
            resourceName={resourceName}
          />
        ))}
      {data
        ?.filter((file) => !file.isDirectory)
        .map((file) => (
          <ResourceFile
            key={file.name}
            resourceFolder={resourceFolder}
            filePath={file.name}
            fileName={file.name}
            resourceName={resourceName}
          />
        ))}
    </CollapsibleFolder>
  )
}

const ResourceFolder = ({
  resourceFolder,
  resourceName,
  folderPath,
  folderName,
}: {
  resourceFolder: string
  folderPath: string
  resourceName: string
  folderName: string
}) => {
  const { data } = orpc.files.list.useQuery({
    resourceName,
    resourceFolder,
    path: folderPath,
  })

  return (
    <CollapsibleFolder trigger={folderName}>
      {data
        ?.filter((file) => file.isDirectory)
        .map((file) => (
          <ResourceFolder
            key={file.name}
            folderName={file.name}
            folderPath={path.join(folderPath, file.name)}
            resourceFolder={resourceFolder}
            resourceName={resourceName}
          />
        ))}
      {data
        ?.filter((file) => !file.isDirectory)
        .map((file) => (
          <ResourceFile
            key={file.name}
            resourceFolder={resourceFolder}
            resourceName={resourceName}
            filePath={path.join(folderPath, file.name)}
            fileName={file.name}
          />
        ))}
    </CollapsibleFolder>
  )
}

const ResourceFile = ({
  filePath,
  fileName,
  resourceFolder,
  resourceName,
}: {
  resourceFolder: string
  filePath: string
  fileName: string
  resourceName: string
}) => {
  const { level } = useFolderContext()
  const Icon = matchFileIcon(fileName)
  return (
    <FileContextMenu>
      <button className="flex w-full items-center gap-1.5 px-1.5 py-1 text-sm transition-colors hover:bg-muted data-[context-menu-state=open]:bg-muted">
        <Icon
          style={{ marginLeft: `${level * 8 + 22}px` }}
          className="size-4"
        />
        {fileName}
      </button>
    </FileContextMenu>
  )
}

const matchFileIcon = (fileName: string): React.ElementType => {
  if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
    return Icons.YAML
  }

  return File
}

export { Resource, ResourceDescription, ValResourcePanel }
