'use client'

import { ColumnDef } from '@tanstack/react-table'
import { UserWithRole } from 'better-auth/plugins'
import { format } from 'date-fns'

import { Badge } from '@valhalla/design-system/components/ui/badge'
import { Checkbox } from '@valhalla/design-system/components/ui/checkbox'
import { DataTableColumnHeader } from '@valhalla/design-system/components/ui/data-table-column-header'

import { ValhallaUserAvatar } from '@/components/ui/val-user-avatar'

import { EditUser } from './edit-user'

export const columns: ColumnDef<UserWithRole>[] = [
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
    id: '用户信息',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="用户信息" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <ValhallaUserAvatar userId={row.original.id} />
          <div className="flex flex-col">
            <span>{row.original.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.email}
            </span>
          </div>
        </div>
      )
    },
    filterFn: 'includesString',
  },
  {
    id: '角色',
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="角色" />
    ),
    cell: ({ row }) => {
      const role = row.original.role
      const roleLabel = role === 'admin' ? '管理员' : '用户'
      return (
        <Badge variant={role === 'admin' ? 'default' : 'outline'}>
          {roleLabel}
        </Badge>
      )
    },
    filterFn: 'includesString',
  },
  {
    id: '状态',
    accessorKey: 'banned',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="状态" />
    ),
    cell: ({ row }) => {
      const banned = row.original.banned
      const bannedLabel = banned ? '已禁用' : '正常'
      return (
        <Badge variant={banned ? 'destructive' : 'outline'}>
          {bannedLabel}
        </Badge>
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
      return <EditUser user={row.original} />
    },
  },
]
