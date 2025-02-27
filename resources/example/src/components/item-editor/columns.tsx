'use client'

import path from 'path'
import Image from 'next/image'
import { ColumnDef } from '@tanstack/react-table'

import { orpc } from '@valhalla/api/react'
import { Checkbox } from '@valhalla/design-system/components/ui/checkbox'
import { DataTableColumnHeader } from '@valhalla/design-system/components/ui/data-table-column-header'
import { useResourceCore } from '@valhalla/design-system/resources/providers/resource-core-provider'

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
    cell: ({ row }) => <Icon row={row.original} />,
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

const Icon = ({ row }: { row: Item }) => {
  const icon = row.icon
  const { filePath, resourceName, resourceFolder } = useResourceCore()
  const folder = path.dirname(filePath)
  const iconPath = path.join(folder, icon.file, '@2d.png')
  const { data } = orpc.files.read.useQuery({
    filePath: iconPath,
    fileName: '@2d.png',
    resourceName: resourceName,
    resourceFolder: resourceFolder,
    readFileOptions: {
      encoding: 'base64',
    },
  }) as { data: string }

  return (
    <div className="border rounded p-1 w-fit">
      {data ? (
        <Image
          src={`data:image/png;base64,${data}`}
          alt={icon.file}
          width={32}
          height={32}
        />
      ) : (
        <div className="w-6 h-6 bg-gray-200 rounded-md" />
      )}
    </div>
  )
}
