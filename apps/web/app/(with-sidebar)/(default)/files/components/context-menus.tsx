'use client'

import path from 'path'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Download,
  Edit,
  FilePlus,
  FolderPlus,
  Trash2,
  Upload,
} from 'lucide-react'
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
import { UploadDialog } from './upload-dialog'

const FolderContextMenu = ({
  children,
  resourceName,
  resourceFolder,
  filePath,
  fileName,
  linkedFolder = false,
  ...props
}: {
  children: React.ReactNode
  resourceName: string
  resourceFolder?: string
  filePath?: string
  fileName?: string
  linkedFolder?: boolean
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
        {resourceName && resourceFolder && filePath && (
          <>
            <CreateFolder
              resourceName={resourceName}
              resourceFolder={resourceFolder}
              filePath={filePath}
            />
            <CreateFile
              resourceName={resourceName}
              resourceFolder={resourceFolder}
              filePath={filePath}
            />
            <ContextMenuSeparator className="my-0" />
            <UploadFile
              resourceName={resourceName}
              resourceFolder={resourceFolder}
              filePath={filePath}
            />
            {!linkedFolder && (
              <>
                <DownloadFile
                  resourceName={resourceName}
                  resourceFolder={resourceFolder}
                  filePath={filePath}
                />
                <MoveFile
                  resourceName={resourceName}
                  resourceFolder={resourceFolder}
                  filePath={filePath}
                  fileName={fileName || filePath}
                />
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

const FileContextMenu = ({
  children,
  resourceName,
  resourceFolder,
  filePath,
  fileName,
}: {
  children: React.ReactNode
  resourceName: string
  resourceFolder?: string
  filePath?: string
  fileName?: string
}) => {
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
        {resourceName && resourceFolder && filePath && (
          <>
            <DownloadFile
              resourceName={resourceName}
              resourceFolder={resourceFolder}
              filePath={filePath}
            />
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

const UploadFile = ({
  resourceName,
  resourceFolder,
  filePath,
}: {
  resourceName: string
  resourceFolder: string
  filePath: string
}) => {
  return (
    <UploadDialog
      resourceName={resourceName}
      resourceFolder={resourceFolder}
      filePath={filePath}
    >
      <MenuItem>
        <Upload className="size-4" />
        上传文件
      </MenuItem>
    </UploadDialog>
  )
}

const DownloadFile = ({
  resourceName,
  resourceFolder,
  filePath,
}: {
  resourceName: string
  resourceFolder: string
  filePath: string
}) => {
  const { mutateAsync } = orpc.files.download.useMutation({
    onError: () => {
      toast.error('下载失败')
    },
  })

  const handleDownload = async () => {
    try {
      const response = await mutateAsync({
        resourceName,
        resourceFolder,
        filePath,
        fileName: 'download',
      })

      // 从响应中提取数据数组
      let uint8Array
      if (response && 'data' in response) {
        uint8Array = new Uint8Array(response.data as number[])
      } else if (Buffer.isBuffer(response)) {
        uint8Array = new Uint8Array(response as Buffer)
      } else if (Array.isArray(response)) {
        uint8Array = new Uint8Array(response)
      } else {
        throw new Error('Invalid response format')
      }

      const blob = new Blob([uint8Array], { type: 'application/octet-stream' })
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      const fileName = filePath.split('/').pop() || 'download'
      const isDirectory = !fileName.includes('.')
      a.download = isDirectory ? `${fileName}.zip` : fileName

      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('下载成功')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('下载失败')
    }
  }

  return (
    <MenuItem onClick={handleDownload}>
      <Download className="size-4" />
      下载
    </MenuItem>
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

const CreateFolder = ({
  resourceName,
  resourceFolder,
  filePath,
}: {
  resourceName: string
  resourceFolder: string
  filePath: string
}) => {
  const [folderName, setFolderName] = useState('')
  const [open, setOpen] = useState(false)
  const utils = orpc.useUtils()
  const { mutateAsync } = orpc.files.createFolder.useMutation({
    onSuccess: () => {
      toast.success('创建成功')
      utils.files.list.invalidate()
      utils.resources.folders.invalidate()
      setOpen(false)
    },
    onError: () => {
      toast.error('创建失败')
    },
  })

  const handleCreate = async () => {
    await mutateAsync({
      resourceName,
      resourceFolder,
      path: filePath,
      folderName,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MenuItem>
          <FolderPlus className="size-4" />
          新建文件夹
        </MenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建文件夹</DialogTitle>
        </DialogHeader>
        <DialogDescription>请输入文件夹名称</DialogDescription>
        <Input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="请输入文件夹名称"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleCreate}>创建</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const CreateFile = ({
  resourceName,
  resourceFolder,
  filePath,
}: {
  resourceName: string
  resourceFolder: string
  filePath: string
}) => {
  const [fileName, setFileName] = useState('')
  const [open, setOpen] = useState(false)
  const utils = orpc.useUtils()
  const { mutateAsync } = orpc.files.createFile.useMutation({
    onSuccess: () => {
      toast.success('创建成功')
      utils.files.list.invalidate()
      utils.resources.folders.invalidate()
      setOpen(false)
    },
    onError: () => {
      toast.error('创建失败')
    },
  })

  const handleCreate = async () => {
    await mutateAsync({
      resourceName,
      resourceFolder,
      path: filePath,
      fileName,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MenuItem>
          <FilePlus className="size-4" />
          新建文件
        </MenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建文件</DialogTitle>
        </DialogHeader>
        <DialogDescription>请输入文件名</DialogDescription>
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="请输入文件名"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleCreate}>创建</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const MoveFile = ({
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
  // 获取当前文件所在的目录路径
  const currentPath = path.dirname(filePath)
  const [newPath, setNewPath] = useState(currentPath)
  const [open, setOpen] = useState(false)
  const utils = orpc.useUtils()

  // 当对话框打开时,重置路径为当前路径
  useEffect(() => {
    if (open) {
      setNewPath(currentPath)
    }
  }, [open, currentPath])

  const { mutateAsync } = orpc.files.move.useMutation({
    onSuccess: () => {
      toast.success('移动成功')
      utils.files.list.invalidate()
      utils.resources.folders.invalidate()
      setOpen(false)
    },
    onError: () => {
      toast.error('移动失败')
    },
  })

  const handleMove = async () => {
    await mutateAsync({
      resourceName,
      resourceFolder,
      filePath,
      fileName,
      newPath,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MenuItem>
          <ArrowRight className="size-4" />
          移动
        </MenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>移动文件</DialogTitle>
        </DialogHeader>
        <DialogDescription>请输入目标路径</DialogDescription>
        <Input
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          placeholder="请输入目标路径"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleMove}>移动</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { FolderContextMenu, FileContextMenu, MenuItem, TabContextMenu }
