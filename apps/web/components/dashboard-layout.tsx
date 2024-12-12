import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@valhalla/design-system/components/ui/breadcrumb'
import { Separator } from '@valhalla/design-system/components/ui/separator'
import { SidebarTrigger } from '@valhalla/design-system/components/ui/sidebar'
import { cn } from '@valhalla/design-system/utils/cn'

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const DashboardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <header
      className={cn(
        'flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12',
        className
      )}
    >
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
  children?: React.ReactNode
  className?: string
}) => {
  return <div className={cn('flex flex-1 flex-col', className)}>{children}</div>
}

export { Dashboard, DashboardHeader, DashboardContent }
