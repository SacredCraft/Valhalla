import Image from 'next/image'
import Link from 'next/link'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@valhalla/design-system/components/ui/sidebar'

const SidebarLogo = () => {
  const { state } = useSidebar()
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem
          className={state === 'expanded' ? 'w-24' : '-ml-2 w-8'}
        >
          <Link href="/dashboard">
            <Image
              src={state === 'expanded' ? '/logo.png' : '/logo-mini.png'}
              sizes="100vw"
              className="h-auto w-full"
              alt="Valhalla"
              width={0}
              height={0}
            />
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export { SidebarLogo }
