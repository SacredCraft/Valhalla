import {
  BreadcrumbItem,
  BreadcrumbPage,
} from '@valhalla/design-system/components/ui/breadcrumb'

import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
} from '@/components/dashboard-layout'
import { FileTabsStoreProvider } from '@/providers/file-tabs-provider'

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
      <DashboardContent>
        <FileTabsStoreProvider>{children}</FileTabsStoreProvider>
      </DashboardContent>
    </Dashboard>
  )
}
