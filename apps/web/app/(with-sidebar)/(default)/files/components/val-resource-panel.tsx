'use client'

import { useState } from 'react'
import { Folder, Sidebar } from 'lucide-react'

import { Button } from '@valhalla/design-system/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
} from '@valhalla/design-system/components/ui/resizable'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@valhalla/design-system/components/ui/sheet'
import { useIsMobile } from '@valhalla/design-system/hooks/use-mobile'

export const ValResourcePanel = ({
  children,
  defaultSize = 20,
  maxSize = 30,
}: {
  children: React.ReactNode
  defaultSize?: number
  maxSize?: number
}) => {
  const isMobile = useIsMobile()
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <div className="absolute bottom-2 left-2 z-[9999]">
        <CollapseButton collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
    )
  }

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
        <div className="h-[calc(100vh-8rem)] overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  ) : (
    <>
      <ResizablePanel
        className="relative h-[calc(100svh-3rem)]"
        defaultSize={defaultSize}
        maxSize={maxSize}
      >
        <div className="h-full overflow-y-auto">{children}</div>
        <div className="absolute bottom-2 right-2">
          <CollapseButton collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
      </ResizablePanel>
      <ResizableHandle className="transition-colors hover:w-1 hover:bg-primary/30" />
    </>
  )
}

const CollapseButton = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setCollapsed(!collapsed)}
    >
      <Sidebar className="size-5" />
    </Button>
  )
}
