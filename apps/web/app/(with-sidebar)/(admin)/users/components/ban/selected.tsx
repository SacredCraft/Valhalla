import { useState } from 'react'
import { Table } from '@tanstack/react-table'
import { UserWithRole } from 'better-auth/plugins'
import { Ban, Ellipsis } from 'lucide-react'

import { Button } from '@valhalla/design-system/components/ui/button'
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
import { toast } from '@valhalla/design-system/components/ui/sonner'

import { orpc } from '@/lib/orpc/react'

import { BanForm, BanFormSubmit } from './shared'

export function BanSelectedButton({ table }: { table: Table<UserWithRole> }) {
  const utils = orpc.useUtils()
  const { mutate: banUsers, isPending } = orpc.users.banUsers.useMutation({
    onSuccess: () => {
      toast.success('封禁成功')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      utils.users.invalidate()
    },
  })

  const handleBanSelected = (
    reason?: string,
    expiresAt?: Date,
    options?: {
      onSuccess?: () => void
      onError?: (error: Error) => void
    }
  ) => {
    banUsers(
      {
        ids: table.getSelectedRowModel().rows.map((row) => row.original.id),
        reason,
        expiresAt,
      },
      {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
      }
    )
  }

  return (
    <div className="flex">
      <Button
        className="rounded-r-none border-r-0 pr-1.5"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => handleBanSelected()}
      >
        <Ban className="size-4" />
        {isPending
          ? '封禁中...'
          : `封禁选中 (${table.getSelectedRowModel().rows.length})`}
      </Button>
      <BanFormDialog
        handleBanSelected={handleBanSelected}
        isPending={isPending}
      />
    </div>
  )
}

const BanFormDialog = ({
  handleBanSelected,
  isPending,
}: {
  handleBanSelected: (
    reason?: string,
    expiresAt?: Date,
    options?: {
      onSuccess?: () => void
      onError?: (error: Error) => void
    }
  ) => void
  isPending: boolean
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-l-none border-l-0 pl-1.5"
          variant="outline"
          size="sm"
        >
          <Ellipsis className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>封禁用户</DialogTitle>
          <DialogDescription>对选中的用户进行额外封禁操作</DialogDescription>
        </DialogHeader>
        <BanForm handleBanSelected={handleBanSelected} setOpen={setOpen}>
          <DialogFooter>
            <BanFormSubmit isPending={isPending} />
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
          </DialogFooter>
        </BanForm>
      </DialogContent>
    </Dialog>
  )
}
