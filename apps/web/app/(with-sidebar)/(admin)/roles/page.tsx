import {
  BreadcrumbItem,
  BreadcrumbPage,
} from '@valhalla/design-system/components/ui/breadcrumb'

import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
} from '@/components/dashboard-layout'

import { RolesTable } from './page.client'

export default function RolesPage() {
  return (
    <Dashboard>
      <DashboardHeader>
        <BreadcrumbItem>
          <BreadcrumbPage>角色管理</BreadcrumbPage>
        </BreadcrumbItem>
      </DashboardHeader>
      <DashboardContent>
        <RolesTable />
      </DashboardContent>
    </Dashboard>
  )
}
