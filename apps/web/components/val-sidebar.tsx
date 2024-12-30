'use client'

import type React from 'react'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { Database, File, Folder, Shield, Users } from 'lucide-react'

import type { Session } from '@valhalla/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@valhalla/design-system/components/ui/sidebar'

import { SidebarLogo } from '@/components/sidebar-logo'
import { ValhallaNavAdmin, ValhallaNavMain } from '@/components/val-nav-main'
import { ValhallaNavUser } from '@/components/val-nav-user'

const data = (pathname: string) => ({
  navMain: [
    {
      title: '文件浏览器',
      url: '/files',
      icon: File,
      isActive: pathname.startsWith('/files'),
    },
  ],
  navAdmin: [
    {
      title: '资源管理',
      url: '/resources/list',
      isActive: pathname.startsWith('/resources'),
      icon: Folder,
    },
    {
      title: '用户管理',
      url: '/users',
      isActive: pathname.startsWith('/users'),
      icon: Users,
    },
    {
      title: '角色管理',
      url: '/roles',
      isActive: pathname.startsWith('/roles'),
      icon: Shield,
    },
    {
      title: '日志管理',
      url: '/logs',
      isActive: pathname.startsWith('/logs'),
      icon: Database,
    },
  ],
})

export function ValhallaSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  session: Session | null
}) {
  const pathname = usePathname()
  const items = useMemo(() => {
    return data(pathname)
  }, [pathname])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <ValhallaNavMain items={items.navMain} />
        <ValhallaNavAdmin items={items.navAdmin} session={session} />
      </SidebarContent>
      <SidebarFooter>
        <ValhallaNavUser session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
