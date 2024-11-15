import type React from 'react'
import { cookies, headers } from 'next/headers'

import { auth } from '@valhalla/auth'
import { SidebarInset, SidebarProvider } from '@valhalla/ui/sidebar'

import { ValhallaSidebar } from '@/components/val-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <ValhallaSidebar session={session} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}