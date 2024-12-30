'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { ResourceRoleWithUsersAndResources } from '@valhalla/db/schema'
import { Checkbox } from '@valhalla/design-system/components/ui/checkbox'

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'

import { EditRole } from './edit-role'

export const columns: ColumnDef<ResourceRoleWithUsersAndResources>[] = [
  {
    id: '选择',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: '角色信息',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="角色信息" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span>{row.original.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.description}
          </span>
        </div>
      )
    },
    filterFn: 'includesString',
  },
  {
    id: '创建时间',
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="创建时间" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      return <span>{format(createdAt, 'yyyy-MM-dd HH:mm:ss')}</span>
    },
  },
  {
    id: '更新时间',
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="更新时间" />
    ),
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt
      return <span>{format(updatedAt, 'yyyy-MM-dd HH:mm:ss')}</span>
    },
  },
  {
    id: '操作',
    cell: ({ row }) => {
      return <EditRole role={row.original} />
    },
  },
]
