'use client'

import { useState } from 'react'
import { Edit, FilePlus, FolderPlus, Trash2, Upload } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import { orpc } from '@valhalla/api/react'
import { Button } from '@valhalla/design-system/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@valhalla/design-system/components/ui/context-menu'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@valhalla/design-system/components/ui/dialog'
import { Input } from '@valhalla/design-system/components/ui/input'
import { toast } from '@valhalla/design-system/components/ui/sonner'
import { cn } from '@valhalla/design-system/utils/cn'

import { ShortcutGroup } from '@/components/ui/shortcut'

import {
  useRemoveAllTabs,
  useRemoveOtherTabs,
  useRemoveTab,
} from '../hooks/use-remove-tab'

const FolderContextMenu = ({
  children,
  resourceName,
  resourceFolder,
  filePath,
  fileName,
  ...props
}: {
  children: React.ReactNode
  resourceName: string
  resourceFolder?: string
  filePath?: string
  fileName?: string
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
        {resourceName && resourceFolder && filePath && (
          <>
            <Rename
              resourceName={resourceName}
              resourceFolder={resourceFolder}
              filePath={filePath}
              fileName={fileName || filePath}
            />
            <DeleteFile
              resourceName={resourceName}
              resourceFolder={resourceFolder}
              filePath={filePath}
              fileName={fileName || filePath}
            />
          </>
        )}
      </MenuContent>
    </ContextMenu>
  )
}

const Rename = ({
  resourceName,
  resourceFolder,
  filePath,
  fileName,
}: {
  resourceName: string
  resourceFolder: string
  filePath: string
  fileName: string
}) => {
  const [newName, setNewName] = useState(fileName)
  const [open, setOpen] = useState(false)
  const utils = orpc.useUtils()
  const { mutateAsync } = orpc.files.rename.useMutation({
    onSuccess: () => {
      toast.success('重命名成功')
      utils.files.list.invalidate()
      utils.resources.folders.invalidate()
      setOpen(false)
    },
    onError: () => {
      toast.error('重命名失败')
    },
  })

  const handleRename = async () => {
    await mutateAsync({
      resourceName,
      resourceFolder,
      filePath,
      fileName,
      newName,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MenuItem>
          <Edit className="size-4" />
          重命名
        </MenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>重命名</DialogTitle>
        </DialogHeader>
        <DialogDescription>请输入新的文件名</DialogDescription>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="请输入新的文件名"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleRename}>重命名</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

const DeleteFile = ({
  resourceName,
  resourceFolder,
  filePath,
  fileName,
}: {
  resourceName: string
  resourceFolder: string
  filePath: string
  fileName: string
}) => {
  const [open, setOpen] = useState(false)
  const utils = orpc.useUtils()
  const { mutateAsync } = orpc.files.delete.useMutation({
    onSuccess: () => {
      toast.success('删除成功')
      utils.files.list.invalidate()
      utils.resources.folders.invalidate()
      setOpen(false)
    },
    onError: () => {
      toast.error('删除失败')
    },
  })

  const handleDelete = async () => {
    await mutateAsync({
      resourceName,
      resourceFolder,
      filePath,
      fileName,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MenuItem>
          <Trash2 className="size-4" />
          删除
        </MenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除</DialogTitle>
        </DialogHeader>
        <DialogDescription>确认删除文件 {filePath} 吗？</DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleDelete}>删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
      onSelect={(e) => {
        e.preventDefault()
      }}
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
