'use client'

import type React from 'react'
import { useState } from 'react'
import {
  BadgeCheck,
  Bell,
  Globe,
  LinkIcon,
  Paintbrush,
  User,
} from 'lucide-react'

import { Session } from '@valhalla/auth'
import { Badge } from '@valhalla/design-system/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@valhalla/design-system/components/ui/breadcrumb'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@valhalla/design-system/components/ui/dialog'
import { DropdownMenuItem } from '@valhalla/design-system/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@valhalla/design-system/components/ui/sidebar'

import { orpc } from '@/lib/orpc/react'

import { ValUserNotifications } from './val-user-notifications'
import { ValUserProfile } from './val-user-profile'

const data = {
  nav: [
    { label: '个人资料', value: 'profile', icon: User },
    { label: '通知', value: 'notifications', icon: Bell },
    { label: '外观', value: 'appearance', icon: Paintbrush },
    { label: '语言和地区', value: 'language-region', icon: Globe },
    {
      label: '连接的账户',
      value: 'connected-accounts',
      icon: LinkIcon,
    },
  ],
}

const ValhallaAccountDialog = ({
  children,
  className,
  defaultActive = 'profile',
  session,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & {
  defaultActive?: string
  session: Session
}) => {
  const [value, setValue] = useState(defaultActive)

  return (
    <Dialog>
      <DialogTrigger className={className} {...props}>
        {children}
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.value}>
                        <SidebarMenuButton
                          isActive={item.value === value}
                          onClick={() => setValue(item.value)}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">设置</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {data.nav.find((item) => item.value === value)?.label}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {value === 'profile' && <ValUserProfile session={session} />}
              {value === 'notifications' && <ValUserNotifications />}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}

const AccountItem = ({ session }: { session: Session }) => {
  return (
    <ValhallaAccountDialog className="w-full" session={session}>
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <BadgeCheck />
        我的账户
      </DropdownMenuItem>
    </ValhallaAccountDialog>
  )
}

const NotificationsItem = ({ session }: { session: Session }) => {
  const { data: hasUnread } = orpc.notifications.hasUnread.useQuery(undefined, {
    refetchInterval: 60000,
  })
  return (
    <ValhallaAccountDialog
      className="w-full"
      session={session}
      defaultActive="notifications"
    >
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <Bell />
        消息通知
        {hasUnread && (
          <Badge className="ml-auto size-2.5 animate-pulse rounded-full p-0" />
        )}
      </DropdownMenuItem>
    </ValhallaAccountDialog>
  )
}

export { ValhallaAccountDialog, AccountItem, NotificationsItem }
