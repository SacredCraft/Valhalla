'use client'

import { Table } from '@tanstack/react-table'
import { Trash } from 'lucide-react'

import { orpc } from '@valhalla/api/react'
import { ResourceRoleWithUsersAndResources } from '@valhalla/db/schema'
import { Button } from '@valhalla/design-system/components/ui/button'
import { toast } from '@valhalla/design-system/components/ui/sonner'

import { CreateRoleButton } from './create-role'

interface DataTableActionsProps {
  table: Table<ResourceRoleWithUsersAndResources>
}

export function DataTableActions({ table }: DataTableActionsProps) {
  const isSelected = table.getSelectedRowModel().rows.length > 0

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex flex-1 items-center space-x-2">
        <CreateRoleButton />
        {isSelected && <DeleteSelectedButton table={table} />}
      </div>
    </div>
  )
}

function DeleteSelectedButton({
  table,
}: {
  table: Table<ResourceRoleWithUsersAndResources>
}) {
  const utils = orpc.useUtils()
  const { mutate: deleteRoles, isPending } =
    orpc.resources.deleteRoles.useMutation({
      onSuccess: () => {
        toast.success('删除成功')
        table.resetRowSelection()
      },
      onError: (error) => {
        toast.error(error.message)
      },
      onSettled: () => {
        utils.resources.roles.invalidate()
      },
    })

  const handleDeleteSelected = () => {
    deleteRoles({
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
