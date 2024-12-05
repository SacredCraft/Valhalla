import {
  BreadcrumbItem,
  BreadcrumbPage,
} from '@valhalla/design-system/components/ui/breadcrumb'

import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
} from '@/components/dashboard-layout'
import { EmptyState } from '@/components/states'

export default function UsersPage() {
  return (
    <Dashboard>
      <DashboardHeader>
        <BreadcrumbItem>
          <BreadcrumbPage>用户管理</BreadcrumbPage>
        </BreadcrumbItem>
      </DashboardHeader>
      <DashboardContent>
        <EmptyState />
      </DashboardContent>
    </Dashboard>
  )
}
