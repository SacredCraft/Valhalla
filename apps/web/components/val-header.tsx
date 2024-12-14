import { headers } from 'next/headers'
import Link from 'next/link'
import { AppleIcon, BoxIcon, TerminalIcon } from 'lucide-react'

import { auth, type Session } from '@valhalla/auth'
import { Button } from '@valhalla/design-system/components/ui/button'

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuSubItem,
  NavigationMenuSubItemDescription,
  NavigationMenuSubItemIcon,
  NavigationMenuSubItemTitle,
  NavigationMenuTrigger,
} from '@/components/ui/val-navigation-menu'

import { ValhallaAccountDropdown } from './ui/val-account-dropdown'
import { ValhallaUserAvatar } from './ui/val-user-avatar'
import { HeaderWrapper } from './val-header.client'

export const ValhallaHeader = () => {
  return (
    <>
      <div className="h-12 sm:h-16" />
      <HeaderWrapper>
        <div className="flex w-full items-center justify-between">
          <ValhallaLogo />
          <ValhallaNavigationMenu />
          <ValhallaActions />
        </div>
      </HeaderWrapper>
    </>
  )
}

const ValhallaActions = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className="hidden items-center gap-2 md:flex">
      {session ? (
        <>
          <Link href="/dashboard">
            <Button>仪表盘</Button>
          </Link>
          <ValhallaAccountDropdown
            side="bottom"
            session={session}
            isMobile={false}
          >
            <ValhallaAccount session={session} />
          </ValhallaAccountDropdown>
        </>
      ) : (
        <Button
          size="sm"
          className="rounded-[8px] shadow-inner"
          variant="outline"
          asChild
        >
          <Link href="/sign-in">登录</Link>
        </Button>
      )}
    </div>
  )
}

const ValhallaLogo = () => {
  return (
    <Link href="/">
      <h1 className="text-lg font-bold">
        <span className="font-mono text-primary">Valhalla</span>
      </h1>
    </Link>
  )
}

const ValhallaNavigationMenu = () => {
  return (
    <NavigationMenuRoot className="absolute left-1/2 hidden -translate-x-1/2 md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>产品</NavigationMenuTrigger>
          <NavigationMenuContent className="z-50 w-64 min-w-32 gap-4 overflow-hidden rounded-lg border bg-popover p-2 text-popover-foreground shadow-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 md:w-64">
            <NavigationMenuSubItem>
              <NavigationMenuSubItemIcon>
                <BoxIcon />
              </NavigationMenuSubItemIcon>
              <NavigationMenuSubItemTitle>产品 1</NavigationMenuSubItemTitle>
              <NavigationMenuSubItemDescription>
                产品描述
              </NavigationMenuSubItemDescription>
            </NavigationMenuSubItem>
            <NavigationMenuSubItem>
              <NavigationMenuSubItemIcon>
                <TerminalIcon />
              </NavigationMenuSubItemIcon>
              <NavigationMenuSubItemTitle>产品 2</NavigationMenuSubItemTitle>
              <NavigationMenuSubItemDescription>
                产品描述
              </NavigationMenuSubItemDescription>
            </NavigationMenuSubItem>
            <NavigationMenuSubItem>
              <NavigationMenuSubItemIcon>
                <AppleIcon />
              </NavigationMenuSubItemIcon>
              <NavigationMenuSubItemTitle>产品 3</NavigationMenuSubItemTitle>
              <NavigationMenuSubItemDescription>
                产品描述
              </NavigationMenuSubItemDescription>
            </NavigationMenuSubItem>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink>文档</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink>联系我们</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenuRoot>
  )
}

const ValhallaAccount = ({ session }: { session: Session }) => {
  return (
    <ValhallaUserAvatar
      className="size-9 cursor-pointer"
      userId={session.user.id}
    />
  )
}
