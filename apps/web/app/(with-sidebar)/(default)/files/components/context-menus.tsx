'use client'

import { useState } from 'react'
import { Edit, FilePlus, FolderPlus, Trash2, Upload } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@valhalla/design-system/components/ui/context-menu'
import { cn } from '@valhalla/design-system/utils/cn'

import { Shortcut, ShortcutGroup } from '@/components/ui/shortcut'

import {
  useRemoveAllTabs,
  useRemoveOtherTabs,
  useRemoveTab,
} from '../hooks/use-remove-tab'

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

const TabContextMenu = ({
  children,
  index,
}: {
  children: React.ReactNode
  index: number
}) => {
  const removeOtherTabs = useRemoveOtherTabs()
  const removeAllTabs = useRemoveAllTabs()
  const removeTab = useRemoveTab()

  useHotkeys('shift+w', () => {
    removeTab(index)
  })

  useHotkeys('shift+d', () => {
    removeOtherTabs(index)
  })

  useHotkeys('shift+a', () => {
    removeAllTabs()
  })

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <MenuContent>
        <MenuItem onClick={() => removeTab(index)}>
          关闭
          <ContextMenuShortcut>
            <ShortcutGroup>⇧W</ShortcutGroup>
          </ContextMenuShortcut>
        </MenuItem>
        <MenuItem onClick={() => removeOtherTabs(index)}>
          关闭其他
          <ContextMenuShortcut>
            <ShortcutGroup>⇧D</ShortcutGroup>
          </ContextMenuShortcut>
        </MenuItem>
        <MenuItem onClick={() => removeAllTabs()}>
          关闭所有
          <ContextMenuShortcut>
            <ShortcutGroup>⇧A</ShortcutGroup>
          </ContextMenuShortcut>
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
  onClick,
}: {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}) => {
  return (
    <ContextMenuItem
      className={cn(
        'min-w-48 gap-2 rounded-none py-1 first:rounded-t last:rounded-b',
        className
      )}
      onClick={onClick}
    >
      {children}
    </ContextMenuItem>
  )
}

export { FolderContextMenu, FileContextMenu, MenuItem, TabContextMenu }
