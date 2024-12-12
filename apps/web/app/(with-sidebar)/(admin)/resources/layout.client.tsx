'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  BreadcrumbItem,
  BreadcrumbPage,
} from '@valhalla/design-system/components/ui/breadcrumb'
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@valhalla/design-system/components/ui/sidebar'

import { matchMenu } from './utils/match-menu'

export const ResourcesBreadcrumb = () => {
  const pathname = usePathname()
  const title = matchMenu(pathname.split('/').pop()!)

  return (
    <BreadcrumbItem>
      <BreadcrumbPage>{title}</BreadcrumbPage>
    </BreadcrumbItem>
  )
}

export const ResourcesPageSidebarItem = ({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) => {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} asChild>
        <Link href={href}>{children}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
