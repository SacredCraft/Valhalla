import { BreadcrumbItem, BreadcrumbPage } from '@valhalla/ui/breadcrumb'

import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
} from '@/components/dashboard-layout'
import { EmptyState } from '@/components/states'

export default function DashboardPage() {
  return (
    <Dashboard>
      <DashboardHeader>
        <BreadcrumbItem>
          <BreadcrumbPage>动态</BreadcrumbPage>
        </BreadcrumbItem>
      </DashboardHeader>
      <DashboardContent>
        <EmptyState />
      </DashboardContent>
    </Dashboard>
  )
}
