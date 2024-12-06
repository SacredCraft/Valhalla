'use client'

import path from 'path'
import React, { Suspense, useState } from 'react'
import { File, Folder, Info, X } from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useHotkeys } from 'react-hotkeys-hook'

import { Button } from '@valhalla/design-system/components/ui/button'
import { ResizablePanel } from '@valhalla/design-system/components/ui/resizable'
import {
  ScrollArea,
  ScrollBar,
} from '@valhalla/design-system/components/ui/scroll-area'
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
import { cn } from '@valhalla/design-system/utils/cn'

import { Components } from '@/__cache__/components'
import { Icons } from '@/components/icons'
import { useDoubleClick } from '@/hooks/use-double-click'
import { orpc } from '@/lib/orpc/react'
import { useFileTabsStore } from '@/providers/file-tabs-provider'

import {
  CollapsibleFolder,
  useFolderContext,
} from './components/collapsible-folder'
import { FileContextMenu, TabContextMenu } from './components/context-menus'
import { useAddTabs } from './hooks/use-add-tabs'
import { useRemoveTab } from './hooks/use-remove-tab'

export const Layout = () => {
  const [currentTabIndex] = useQueryState('tab', parseAsInteger.withDefault(0))
  const { tabs, addTab, removeTab } = useFileTabsStore((state) => state)
  const currentTab = tabs[currentTabIndex]
  const { data } = orpc.resources.layout.useQuery({
    resourceName: currentTab?.resourceName,
    resourceFolder: currentTab?.resourceFolder,
    filePath: currentTab?.filePath,
    fileName: currentTab?.fileName,
  })

  const Comp = Components[data?.component ?? '']

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
  const handleDoubleClick = useDoubleClick({ delay: 300 })
  const addTab = useAddTabs()
  const { tabs } = useFileTabsStore((state) => state)
  const [currentTabIndex] = useQueryState('tab', parseAsInteger.withDefault(0))
  const index = tabs.findIndex(
    (tab) =>
      tab.filePath === filePath &&
      tab.fileName === fileName &&
      tab.resourceName === resourceName &&
      tab.resourceFolder === resourceFolder
  )
  const isActive = index !== -1 && index === currentTabIndex
  const { level } = useFolderContext()
  const Icon = matchFileIcon(fileName)

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

const Tabs = () => {
  const [currentTab, setCurrentTab] = useQueryState(
    'tab',
    parseAsInteger.withDefault(0)
  )
  const { tabs } = useFileTabsStore((state) => state)

  useHotkeys('arrowleft', () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1)
    }
  })

  useHotkeys('arrowright', () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1)
    }
  })

  return (
    <ScrollArea type="hover">
      <header className="flex items-center">
        {tabs.map((tab, index) => (
          <Tab
            key={tab.filePath}
            index={index}
            isActive={currentTab === index}
            isModified={tab.isModified}
            setTabs={() => setCurrentTab(index)}
          >
            <Icons.YAML className="size-4" />
            {tab.fileName}
          </Tab>
        ))}
      </header>
      <ScrollBar className="h-1.5" orientation="horizontal" />
    </ScrollArea>
  )
}

const Tab = ({
  children,
  isActive,
  isModified,
  setTabs,
  index,
}: {
  children: React.ReactNode
  isActive: boolean
  isModified: boolean
  setTabs: () => void
  index: number
}) => {
  const [isCloseHovered, setIsCloseHovered] = useState(false)
  const removeTab = useRemoveTab()

  useHotkeys(`shift+${index + 1}`, () => {
    setTabs()
  })

  return (
    <TabContextMenu index={index}>
      <div
        onClick={setTabs}
        className={cn(
          'group relative flex h-9 min-w-[112px] cursor-pointer items-center gap-1 bg-transparent px-2 text-start text-sm transition-colors hover:bg-primary/10',
          isActive
            ? 'fill-primary text-primary'
            : 'fill-muted-foreground text-muted-foreground'
        )}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-0 bottom-0 z-[1] h-[2px] w-full bg-primary" />
        )}
        {isModified && (
          <span
            className={cn(
              'absolute right-[14px] size-2 rounded-full',
              isActive ? 'bg-primary' : 'bg-muted-foreground',
              !isModified && 'group-hover:hidden',
              isCloseHovered && 'hidden'
            )}
          />
        )}

        <button
          className={cn(
            'absolute right-[8px] z-[1] flex size-5 items-center justify-center rounded-md opacity-0 hover:bg-primary/10',
            isCloseHovered && 'opacity-100',
            !isModified && 'group-hover:opacity-100'
          )}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          onClick={(e) => {
            e.stopPropagation()
            removeTab(index)
          }}
        >
          <X className="size-4" />
        </button>
      </div>
    </TabContextMenu>
  )
}

export { Resource, ResourceDescription, ValResourcePanel, Tabs }
