'use client'

import { Table } from '@tanstack/react-table'
import { UserWithRole } from 'better-auth/plugins'
import { Ban, Trash } from 'lucide-react'

import { orpc } from '@valhalla/api/react'
import { Button } from '@valhalla/design-system/components/ui/button'
import { toast } from '@valhalla/design-system/components/ui/sonner'

import { BanSelectedButton } from './ban/selected'
import { CreateUserButton } from './create-user'

interface DataTableActionsProps {
  table: Table<UserWithRole>
}

export function DataTableActions({ table }: DataTableActionsProps) {
  const isSelected = table.getSelectedRowModel().rows.length > 0

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex flex-1 items-center space-x-2">
        <CreateUserButton />
        {isSelected && <DeleteSelectedButton table={table} />}
        {isSelected && <BanSelectedButton table={table} />}
        {isSelected && <UnbanSelectedButton table={table} />}
      </div>
    </div>
  )
}

function DeleteSelectedButton({ table }: { table: Table<UserWithRole> }) {
  const utils = orpc.useUtils()
  const { mutate: deleteUsers, isPending } = orpc.users.deleteUsers.useMutation(
    {
      onSuccess: () => {
        toast.success('删除成功')
        table.resetRowSelection()
      },
      onError: (error) => {
        toast.error(error.message)
      },
      onSettled: () => {
        utils.users.invalidate()
      },
    }
  )

  const handleDeleteSelected = () => {
    deleteUsers({
      ids: table.getSelectedRowModel().rows.map((row) => row.original.id),
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleDeleteSelected}
    >
      <Trash className="size-4" />
      {isPending
        ? '删除中...'
        : `删除选中 (${table.getSelectedRowModel().rows.length})`}
    </Button>
  )
}

function UnbanSelectedButton({ table }: { table: Table<UserWithRole> }) {
  const utils = orpc.useUtils()
  const { mutate: unbanUsers, isPending } = orpc.users.unbanUsers.useMutation({
    onSuccess: () => {
      utils.users.invalidate()
      toast.success('解封成功')
    },
  })

  const handleUnbanSelected = () => {
    unbanUsers({
      ids: table.getSelectedRowModel().rows.map((row) => row.original.id),
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleUnbanSelected}
    >
      <Ban className="size-4" />
      {isPending
        ? '解封中...'
        : `解封选中 (${table.getSelectedRowModel().rows.length})`}
    </Button>
  )
}
