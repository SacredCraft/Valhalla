'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  ScrollArea,
  ScrollBar,
} from '@valhalla/design-system/components/ui/scroll-area'
import { cn } from '@valhalla/design-system/utils/cn'

import { Icons } from '@/__cache__/icons'
import { orpc } from '@/lib/orpc/react'
import { useFileTabsStore } from '@/providers/file-tabs-provider'

import { useRemoveTab } from '../hooks/use-remove-tab'
import { TabContextMenu } from './context-menus'

export const Tabs = ({
  currentTab,
  setCurrentTab,
}: {
  currentTab: number
  setCurrentTab: (index: number) => void
}) => {
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
            key={`${tab.resourceName}-${tab.resourceFolder}-${tab.filePath}-${tab.fileName}`}
            resourceName={tab.resourceName}
            resourceFolder={tab.resourceFolder}
            filePath={tab.filePath}
            fileName={tab.fileName}
            index={index}
            isActive={currentTab === index}
            isModified={tab.isModified}
            setTabs={() => setCurrentTab(index)}
          >
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
  resourceName,
  resourceFolder,
  filePath,
  fileName,
}: {
  children: React.ReactNode
  isActive: boolean
  isModified: boolean
  setTabs: () => void
  index: number
  resourceName: string
  resourceFolder: string
  filePath: string
  fileName: string
}) => {
  const [isCloseHovered, setIsCloseHovered] = useState(false)
  const removeTab = useRemoveTab()
  const { data: matchLayout } = orpc.files.layout.useQuery({
    resourceName,
    resourceFolder,
    filePath,
    fileName,
  })

  useHotkeys(`shift+${index + 1}`, () => {
    setTabs()
  })

  if (!matchLayout) {
    // TODO: 文件可能已被删除或重命名
    // TODO: remove from store
    return null
  }

  const Icon = Icons[matchLayout.icon ?? 'File']

  return (
    <TabContextMenu index={index}>
      <div
        onClick={setTabs}
        className={cn(
          'group relative flex h-9 min-w-[112px] cursor-pointer select-none items-center gap-1 bg-transparent px-2 text-start text-sm transition-colors hover:bg-primary/10',
          '[&>svg]:size-4',
          isActive
            ? 'fill-primary text-primary'
            : 'fill-muted-foreground text-muted-foreground'
        )}
      >
        {Icon && <Icon.default />}
        {children}
        {isActive && (
          <span className="absolute inset-x-0 bottom-[2px] z-[1] h-[2px] w-full bg-primary" />
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

        <span className="size-5" />
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
