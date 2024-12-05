'use client'

import type { Session } from '@valhalla/auth'
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@valhalla/design-system/components/ui/sidebar'

import {
  ValhallaAccountDropdown,
  ValhallaAccountDropdownSidebarTrigger,
} from './ui/val-account-dropdown'

export function ValhallaNavUser({ session }: { session: Session | null }) {
  const { isMobile } = useSidebar()

  if (!session) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <ValhallaAccountDropdown session={session} isMobile={isMobile}>
          <ValhallaAccountDropdownSidebarTrigger session={session} />
        </ValhallaAccountDropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
