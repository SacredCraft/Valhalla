'use client'

import { Folder } from 'lucide-react'

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
