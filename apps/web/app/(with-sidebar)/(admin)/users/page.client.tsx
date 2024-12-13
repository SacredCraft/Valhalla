'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { orpc } from '@valhalla/api/react'

import { authClient } from '@/lib/auth/client'

import { columns } from './components/columns'
import { DataTable } from './components/data-table'

export const UsersTable = () => {
  const { data: users } = orpc.users.list.useQuery({})

  return <DataTable columns={columns} data={users ?? []} />
}
