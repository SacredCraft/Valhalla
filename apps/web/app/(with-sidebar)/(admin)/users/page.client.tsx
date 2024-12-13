'use client'

import { orpc } from '@valhalla/api/react'

import { columns } from './components/columns'
import { DataTable } from './components/data-table'

export const UsersTable = () => {
  const { data: users } = orpc.users.list.useQuery({})

  return <DataTable columns={columns} data={users ?? []} />
}
