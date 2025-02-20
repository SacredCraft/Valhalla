'use client'

import { useState } from 'react'
import { cva } from 'class-variance-authority'
import { ChevronRight, Folder, FolderOpen, Link } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@valhalla/design-system/components/ui/collapsible'
import { cn } from '@valhalla/design-system/utils/cn'
import { createContext } from '@valhalla/design-system/utils/context'

import { FolderContextMenu } from './context-menus'

const folderVariants = cva(
  'flex w-full items-center gap-1.5 truncate px-1.5 py-1 text-sm transition-colors hover:bg-muted data-[context-menu-state=open]:bg-muted'
)

interface CollapsibleFolderProps {
  children?: React.ReactNode
  trigger: React.ReactNode
  className?: string
  folderIcon?: boolean
  linkIcon?: boolean
  contextMenu?: React.ReactNode
  resourceName: string
  resourceFolder?: string
  filePath?: string
  fileName?: string
  linkedFolder?: boolean
}

export const CollapsibleFolder = ({
  children,
  trigger,
  className,
  folderIcon = true,
  linkIcon = false,
  contextMenu = true,
  resourceName,
  resourceFolder,
  filePath,
  fileName,
  linkedFolder = false,
}: CollapsibleFolderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { level } = useFolderContext()

  const Trigger = (
    <button className={folderVariants()}>
      <ChevronRight
        className={cn(
          'size-4 shrink-0 transition-transform',
          isOpen && 'rotate-90'
        )}
        style={{
          marginLeft: `${level * 8}px`,
        }}
      />
      {linkIcon ? (
        <Link className="size-4 shrink-0" />
      ) : (
        folderIcon &&
        (isOpen ? (
          <FolderOpen className="size-4 shrink-0" />
        ) : (
          <Folder className="size-4 shrink-0" />
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
            <FolderContextMenu
              resourceName={resourceName}
              resourceFolder={resourceFolder}
              filePath={filePath}
              fileName={fileName}
              linkedFolder={linkedFolder}
            >
              {Trigger}
            </FolderContextMenu>
          ) : (
            Trigger
          )}
        </CollapsibleTrigger>
        <CollapsibleContent forceMount>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.1 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
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
