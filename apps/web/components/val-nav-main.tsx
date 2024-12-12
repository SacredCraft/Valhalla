'use client'

import Link from 'next/link'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import type { LucideIcon } from 'lucide-react'

import { Session } from '@valhalla/auth'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@valhalla/design-system/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@valhalla/design-system/components/ui/sidebar'

type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]
}

const renderItems = (items: NavItem[]) => {
  return (
    <>
      {items
        .filter((item) => item.items)
        .map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={item.isActive}
                  tooltip={item.title}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton isActive={subItem.isActive} asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}

      {items
        .filter((item) => !item.items)
        .map((item) => (
          <SidebarMenuButton
            key={item.title}
            isActive={item.isActive}
            tooltip={item.title}
            asChild
          >
            <Link href={item.url}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        ))}
    </>
  )
}

export function ValhallaNavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>用户导航</SidebarGroupLabel>
      <SidebarMenu>{renderItems(items)}</SidebarMenu>
    </SidebarGroup>
  )
}

export function ValhallaNavAdmin({
  items,
  session,
}: {
  items: NavItem[]
  session: Session | null
}) {
  const isAdmin = session?.user?.role === 'admin'
  if (!isAdmin) {
    return null
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:mt-auto">
      <SidebarGroupLabel>管理导航</SidebarGroupLabel>
      <SidebarMenu>{renderItems(items)}</SidebarMenu>
    </SidebarGroup>
  )
}
