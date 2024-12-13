'use client'

import { orpc } from '@valhalla/api/react'

import { PaginationStoreProvider } from '@/providers/pagination-provider'

import { columns } from './components/columns'
import { DataTable } from './components/data-table'

export const UsersTable = () => {
  const { data: users } = orpc.users.list.useQuery({})

  return (
    <PaginationStoreProvider>
      <DataTable columns={columns} data={users ?? []} />
    </PaginationStoreProvider>
  )
}
