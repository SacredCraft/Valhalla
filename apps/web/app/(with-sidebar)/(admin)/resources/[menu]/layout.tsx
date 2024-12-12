import Link from 'next/link'
import { List, Settings } from 'lucide-react'

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@valhalla/design-system/components/ui/breadcrumb'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@valhalla/design-system/components/ui/sidebar'

import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
} from '@/components/dashboard-layout'

import { matchMenu } from './utils/match-menu'

export default async function ResourcesLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ menu: string }>
}) {
  const menu = (await params).menu
  const title = matchMenu(menu)

  return (
    <Dashboard>
      <DashboardHeader>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">资源管理</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </DashboardHeader>
      <DashboardContent className="flex-row">
        <ResourcesPageSidebar menu={menu} />
        <div className="p-2">{children}</div>
      </DashboardContent>
    </Dashboard>
  )
}

const ResourcesPageSidebar = ({ menu }: { menu: string }) => {
  return (
    <Sidebar collapsible="none" className="bg-transparent">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <ResourcesPageSidebarItem
                href="/resources/list"
                isActive={menu === 'list'}
              >
                <List />
                资源列表
              </ResourcesPageSidebarItem>
              <ResourcesPageSidebarItem
                href="/resources/configs"
                isActive={menu === 'configs'}
              >
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

const ResourcesPageSidebarItem = ({
  children,
  href,
  isActive,
}: {
  children: React.ReactNode
  href: string
  isActive: boolean
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} asChild>
        <Link href={href}>{children}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
