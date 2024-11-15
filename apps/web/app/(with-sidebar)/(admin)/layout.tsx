import { headers } from 'next/headers'

import { auth } from '@valhalla/auth'

import { UnauthorizedState } from '@/components/states'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || session.user.role !== 'admin') {
    return <UnauthorizedState />
  }

  return <>{children}</>
}
