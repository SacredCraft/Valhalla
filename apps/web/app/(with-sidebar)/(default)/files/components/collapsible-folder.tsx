'use client'

import { useState } from 'react'
import { cva } from 'class-variance-authority'
import { ChevronRight, Folder, FolderOpen, Link } from 'lucide-react'

import { cn } from '@valhalla/ui/cn'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@valhalla/ui/collapsible'
import { createContext } from '@valhalla/ui/context'

import { FolderContextMenu } from './context-menus'

const folderVariants = cva(
  'flex w-full items-center gap-1.5 px-1.5 py-1 text-sm transition-colors hover:bg-muted data-[context-menu-state=open]:bg-muted'
)

interface CollapsibleFolderProps {
  children?: React.ReactNode
  trigger: React.ReactNode
  className?: string
  folderIcon?: boolean
  linkIcon?: boolean
  contextMenu?: React.ReactNode
}

export const CollapsibleFolder = ({
  children,
  trigger,
  className,
  folderIcon = true,
  linkIcon = false,
  contextMenu = true,
}: CollapsibleFolderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { level } = useFolderContext()

  const Trigger = (
    <button className={folderVariants()}>
      <ChevronRight
        className={cn('size-4 transition-transform', isOpen && 'rotate-90')}
        style={{
          marginLeft: `${level * 8}px`,
        }}
      />
      {linkIcon ? (
        <Link className="size-4" />
      ) : (
        folderIcon &&
        (isOpen ? (
          <FolderOpen className="size-4" />
        ) : (
          <Folder className="size-4" />
        ))
      )}
      {trigger}
    </button>
  )

  return (
    <FolderProvider value={{ level: level + 1 }}>
      <Collapsible
        className={cn('w-full p-0', className)}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <CollapsibleTrigger asChild>
          {contextMenu ? (
            <FolderContextMenu>{Trigger}</FolderContextMenu>
          ) : (
            Trigger
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>{children}</CollapsibleContent>
      </Collapsible>
    </FolderProvider>
  )
}

const [FolderProvider, useFolderContext] = createContext<{
  level: number
}>({
  level: 0,
})

export { FolderProvider, useFolderContext }
