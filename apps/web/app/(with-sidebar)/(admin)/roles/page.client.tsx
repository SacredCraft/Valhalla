'use client'
'use client'

import { orpc } from '@valhalla/api/react'

import { PaginationStoreProvider } from '@/providers/pagination-provider'

import { columns } from './components/columns'
import { DataTable } from './components/data-table'

export const RolesTable = () => {
  const { data: roles } = orpc.resources.roles.useQuery({})

  return (
    <PaginationStoreProvider>
      <DataTable columns={columns} data={roles ?? []} />
    </PaginationStoreProvider>
  )
}
