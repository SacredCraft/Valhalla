'use client'

import { Table } from '@tanstack/react-table'
import { UserWithRole } from 'better-auth/plugins'
import { Trash } from 'lucide-react'

import { orpc } from '@valhalla/api/react'
import { Button } from '@valhalla/design-system/components/ui/button'
import { toast } from '@valhalla/design-system/components/ui/sonner'

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
      </div>
    </div>
  )
}

function DeleteSelectedButton({ table }: { table: Table<UserWithRole> }) {
  const utils = orpc.useUtils()
  const { mutate: deleteUsers, isPending } = orpc.users.deleteUsers.useMutation(
    {
      onSuccess: () => {
        utils.users.invalidate()
        toast.success('删除成功')
        table.resetRowSelection()
      },
      onError: (error) => {
        toast.error(error.message)
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
