import { CaretSortIcon } from '@radix-ui/react-icons'
import { LogOut, UserIcon } from 'lucide-react'

import type { Session } from '@valhalla/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@valhalla/ui/avatar'
import { Badge } from '@valhalla/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@valhalla/ui/dropdown-menu'
import { SidebarMenuButton } from '@valhalla/ui/sidebar'

import { orpc } from '@/lib/orpc/react'

import { SignOutButton } from '../sign-out-button'
import { AccountItem, NotificationsItem } from '../val-account-dialog'

interface ValhallaAccountDropdownProps {
  session: Session
  isMobile: boolean
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

const ValhallaAccountDropdown = ({
  session,
  isMobile,
  children,
  side,
}: ValhallaAccountDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        forceMount
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={side ? side : isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={session.user.image} alt={session.user.name} />
              <AvatarFallback className="rounded-lg">
                <UserIcon />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {session.user.name}
                {session.user.role === 'admin' && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (管理员)
                  </span>
                )}
              </span>
              <span className="truncate text-xs">{session.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <AccountItem session={session} />
          <NotificationsItem session={session} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutButton asChild>
          <DropdownMenuItem>
            <LogOut />
            退出登录
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ValhallaAccountDropdownSidebarTrigger = ({
  session,
  ...props
}: React.ComponentProps<typeof SidebarMenuButton> & { session: Session }) => {
  const { data: hasUnread } = orpc.notifications.hasUnread.useQuery(undefined, {
    refetchInterval: 60000,
  })

  const { data: image } = orpc.avatar.get.useQuery({ userId: session.user.id })

  const imageUrl = image
    ? `data:image/jpeg;base64,${Buffer.from(image).toString('base64')}`
    : undefined

  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      {...props}
    >
      <Avatar className="size-8 rounded-lg">
        <AvatarImage src={imageUrl} alt={session.user.name} />
        <AvatarFallback className="rounded-lg">
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {session.user.name}
          {session.user.role === 'admin' && (
            <span className="ml-1 text-xs text-muted-foreground">(管理员)</span>
          )}
        </span>
        <span className="truncate text-xs">{session.user.email}</span>
      </div>
      {hasUnread && (
        <Badge className="size-2.5 animate-pulse rounded-full p-0" />
      )}
      <CaretSortIcon className="ml-auto size-4" />
    </SidebarMenuButton>
  )
}

export { ValhallaAccountDropdown, ValhallaAccountDropdownSidebarTrigger }
