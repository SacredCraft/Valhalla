'use client'

import Image from 'next/image'
import { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@valhalla/design-system/components/ui/checkbox'
import { DataTableColumnHeader } from '@valhalla/design-system/components/ui/data-table-column-header'

import { useItemEditor } from './hooks'

export type Item = {
  display: string
  icon: {
    base: string
    file: string
  }
  quality: number
  name: string
  description: string
  meta: {
    'hide-all': boolean
  }
  'item-type': string
}

export const columns: ColumnDef<Item>[] = [
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
    id: '2D 图标',
    accessorKey: 'icon',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="2D 图标" />
    ),
    cell: ({ row }) => {
      const icon = row.original.icon
      return (
        <div className="border rounded p-1 w-fit">
          <Image
            src={`/assets/example/${icon.file}/@2d.png`}
            alt={icon.file}
            width={32}
            height={32}
          />
        </div>
      )
    },
  },
  {
    id: 'ID',
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <ID row={row.original} />,
  },
  {
    id: '显示名称',
    accessorKey: 'display',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="显示名称" />
    ),
  },
  {
    id: '类型',
    accessorKey: 'item-type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="类型" />
    ),
  },
  {
    id: '品质',
    accessorKey: 'quality',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="品质" />
    ),
  },
]

const ID = ({ row }: { row: Item }) => {
  const { parsedContent } = useItemEditor()

  if (!parsedContent) return null

  const id = Object.keys(parsedContent).find(
    (key) => parsedContent[key].name === row.name
  )

  return <>{id}</>
}
