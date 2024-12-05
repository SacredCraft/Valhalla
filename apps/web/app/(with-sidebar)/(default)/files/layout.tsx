import {
  BreadcrumbItem,
  BreadcrumbPage,
} from '@valhalla/design-system/components/ui/src/primitives/breadcrumb'

import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
} from '@/components/dashboard-layout'

export default function FilesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Dashboard>
      <DashboardHeader>
        <BreadcrumbItem>
          <BreadcrumbPage>文件管理器</BreadcrumbPage>
        </BreadcrumbItem>
      </DashboardHeader>
      <DashboardContent>{children}</DashboardContent>
    </Dashboard>
  )
}
