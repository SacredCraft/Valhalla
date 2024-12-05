'use client'

import { useState } from 'react'
import { Edit, FilePlus, FolderPlus, Trash2, Upload } from 'lucide-react'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@valhalla/design-system/components/ui/context-menu'
import { cn } from '@valhalla/design-system/utils/cn'

const FolderContextMenu = ({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<typeof ContextMenuTrigger>) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ContextMenu onOpenChange={setIsOpen}>
      <ContextMenuTrigger
        data-context-menu-state={isOpen ? 'open' : 'closed'}
        asChild
        {...props}
      >
        {children}
      </ContextMenuTrigger>
      <MenuContent>
        <MenuItem>
          <FolderPlus className="size-4" />
          新建文件夹
        </MenuItem>
        <MenuItem>
          <FilePlus className="size-4" />
          新建文件
        </MenuItem>
        <MenuItem>
          <Upload className="size-4" />
          上传文件
        </MenuItem>
        <ContextMenuSeparator className="my-0" />
        <MenuItem>
          <Edit className="size-4" />
          重命名
        </MenuItem>
        <MenuItem>
          <Trash2 className="size-4" />
          删除
        </MenuItem>
      </MenuContent>
    </ContextMenu>
  )
}

const FileContextMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ContextMenu onOpenChange={setIsOpen}>
      <ContextMenuTrigger
        data-context-menu-state={isOpen ? 'open' : 'closed'}
        asChild
      >
        {children}
      </ContextMenuTrigger>
      <MenuContent>
        <MenuItem>
          <Edit className="size-4" />
          重命名
        </MenuItem>
        <MenuItem>
          <Trash2 className="size-4" />
          删除
        </MenuItem>
      </MenuContent>
    </ContextMenu>
  )
}

const MenuContent = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <ContextMenuContent className={cn('gap-2 p-0', className)}>
      {children}
    </ContextMenuContent>
  )
}

const MenuItem = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <ContextMenuItem
      className={cn(
        'min-w-48 gap-2 rounded-none py-1 first:rounded-t last:rounded-b',
        className
      )}
    >
      {children}
    </ContextMenuItem>
  )
}

export { FolderContextMenu, FileContextMenu, MenuItem }
