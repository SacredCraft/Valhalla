'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  ScrollArea,
  ScrollBar,
} from '@valhalla/design-system/components/ui/scroll-area'
import { cn } from '@valhalla/design-system/utils/cn'

import { Icons } from '@/components/icons'
import { useFileTabsStore } from '@/providers/file-tabs-provider'

import { useRemoveTab } from '../hooks/use-remove-tab'
import { TabContextMenu } from './context-menus'

export const Tabs = () => {
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
          'group relative flex h-9 min-w-[112px] cursor-pointer select-none items-center gap-1 bg-transparent px-2 text-start text-sm transition-colors hover:bg-primary/10',
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
