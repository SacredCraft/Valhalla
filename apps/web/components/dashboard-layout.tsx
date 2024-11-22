import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@valhalla/ui/breadcrumb'
import { cn } from '@valhalla/ui/cn'
import { Separator } from '@valhalla/ui/separator'
import { SidebarTrigger } from '@valhalla/ui/sidebar'

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const DashboardHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">仪表盘</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            {children}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}

const DashboardContent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn('flex flex-1 flex-col', className)}>{children}</div>
}

export { Dashboard, DashboardHeader, DashboardContent }
