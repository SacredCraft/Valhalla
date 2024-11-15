'use client'

import type React from 'react'
import { AppWindow, Database, FileIcon, Shield, Users } from 'lucide-react'

import type { Session } from '@valhalla/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@valhalla/ui/sidebar'

import { SidebarLogo } from '@/components/sidebar-logo'
import { ValhallaNavAdmin, ValhallaNavMain } from '@/components/val-nav-main'
import { ValhallaNavUser } from '@/components/val-nav-user'

const data = {
  navMain: [
    {
      title: '文件管理器',
      url: '#',
      icon: FileIcon,
    },
    {
      title: '文件浏览器',
      url: '#',
      icon: AppWindow,
    },
  ],
  navAdmin: [
    {
      title: '用户管理',
      url: '/users',
      icon: Users,
    },
    {
      title: '角色管理',
      url: '#',
      icon: Shield,
    },
    {
      title: '日志管理',
      url: '#',
      icon: Database,
    },
  ],
}

export function ValhallaSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  session: Session | null
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <ValhallaNavMain items={data.navMain} />
        <ValhallaNavAdmin items={data.navAdmin} session={session} />
      </SidebarContent>
      <SidebarFooter>
        <ValhallaNavUser session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
