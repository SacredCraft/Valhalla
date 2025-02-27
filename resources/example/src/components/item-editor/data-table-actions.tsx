'use client'

import { Plus } from 'lucide-react'

import { Button } from '@valhalla/design-system/components/ui/button'

import { DataTableActionsProps } from './types'

export function DataTableActions({ table }: DataTableActionsProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex flex-1 items-center space-x-2">
        <Button>
          <Plus />
          添加物品
        </Button>
      </div>
    </div>
  )
}
