'use client'

import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { Button } from '@valhalla/design-system/components/ui/button'
import { Input } from '@valhalla/design-system/components/ui/input'

import { DataTableViewOptions } from '@/components/ui/data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="搜索角色..."
          value={
            (table.getColumn('角色信息')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('角色信息')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            重置
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}