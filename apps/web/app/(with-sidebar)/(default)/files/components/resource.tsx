'use client'

import path from 'path'
import { Info } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@valhalla/design-system/components/ui/tooltip'
import { cn } from '@valhalla/design-system/utils/cn'

import { Icons } from '@/__cache__/icons'
import { useDoubleClick } from '@/hooks/use-double-click'
import { orpc } from '@/lib/orpc/react'
import { useFileTabsStore } from '@/providers/file-tabs-provider'

import { useAddTabs } from '../hooks/use-add-tabs'
import { useTabs } from '../hooks/use-tabs'
import { CollapsibleFolder, useFolderContext } from './collapsible-folder'
import { FileContextMenu } from './context-menus'

export const Resource = ({
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

export const ResourceDescription = ({
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
            icon={file.icon}
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
            icon={file.icon}
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
  icon,
}: {
  resourceFolder: string
  filePath: string
  fileName: string
  resourceName: string
  icon: string
}) => {
  const handleDoubleClick = useDoubleClick({ delay: 300 })
  const addTab = useAddTabs()
  const { tabs } = useFileTabsStore((state) => state)
  const { currentTabIndex } = useTabs()
  const index = tabs.findIndex(
    (tab) =>
      tab.filePath === filePath &&
      tab.fileName === fileName &&
      tab.resourceName === resourceName &&
      tab.resourceFolder === resourceFolder
  )
  const isActive = index !== -1 && index === currentTabIndex
  const { level } = useFolderContext()
  const Icon = Icons[icon]

  return (
    <FileContextMenu>
      <button
        onClick={() =>
          handleDoubleClick(() => {
            addTab({
              resourceName,
              resourceFolder,
              filePath,
              fileName,
              currentTabIndex,
            })
          })
        }
        className={cn(
          'flex w-full items-center gap-1.5 px-1.5 py-1 text-sm transition-colors hover:bg-muted data-[context-menu-state=open]:bg-muted',
          isActive && 'bg-primary/10 text-primary'
        )}
      >
        <span
          className="[&>svg]:size-4"
          style={{ marginLeft: `${level * 8 + 22}px` }}
        >
          {Icon ? <Icon.default /> : null}
        </span>
        {fileName}
      </button>
    </FileContextMenu>
  )
}
