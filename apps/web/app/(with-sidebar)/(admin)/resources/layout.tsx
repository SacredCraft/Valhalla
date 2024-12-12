import { List, Settings } from 'lucide-react'

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@valhalla/design-system/components/ui/breadcrumb'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@valhalla/design-system/components/ui/sidebar'

import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
} from '@/components/dashboard-layout'

import { ResourcesBreadcrumb, ResourcesPageSidebarItem } from './layout.client'

export default async function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Dashboard>
      <DashboardHeader>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">资源管理</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <ResourcesBreadcrumb />
      </DashboardHeader>
      <DashboardContent className="flex-row">
        <ResourcesPageSidebar />
        <div className="flex-1 p-2">{children}</div>
      </DashboardContent>
    </Dashboard>
  )
}

const ResourcesPageSidebar = () => {
  return (
    <Sidebar collapsible="none" className="bg-transparent">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <ResourcesPageSidebarItem href="/resources/list">
                <List />
                资源列表
              </ResourcesPageSidebarItem>
              <ResourcesPageSidebarItem href="/resources/configs">
                <Settings />
                配置管理
              </ResourcesPageSidebarItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
