import React from 'react'
import { ChevronRightIcon } from 'lucide-react'

import { cn } from '@valhalla/ui/cn'
import {
  navigationMenuTriggerStyle,
  NavigationMenuLink as ShadCNNavigationMenuLink,
  NavigationMenuRoot as ShadCNNavigationMenuRoot,
  NavigationMenuTrigger as ShadCNNavigationMenuTrigger,
  NavigationMenuViewport as ShadCNNavigationMenuViewport,
} from '@valhalla/ui/navigation-menu'

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuViewport,
} from '@valhalla/ui/navigation-menu'

const NavigationMenuRoot = React.forwardRef<
  React.ComponentRef<typeof ShadCNNavigationMenuRoot>,
  React.ComponentPropsWithoutRef<typeof ShadCNNavigationMenuRoot>
>(({ className, children, ...props }, ref) => (
  <ShadCNNavigationMenuRoot
    ref={ref}
    className={cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className
    )}
    {...props}
  >
    {children}
    <NavigationViewport />
  </ShadCNNavigationMenuRoot>
))
NavigationMenuRoot.displayName = 'ValhallaNavigationMenuRoot'

const NavigationViewport = React.forwardRef<
  React.ComponentRef<typeof ShadCNNavigationMenuViewport>,
  React.ComponentPropsWithoutRef<typeof ShadCNNavigationMenuViewport>
>(({ className, children, ...props }, ref) => (
  <ShadCNNavigationMenuViewport
    ref={ref}
    className={cn('border-none', className)}
    {...props}
  >
    {children}
  </ShadCNNavigationMenuViewport>
))
NavigationViewport.displayName = ShadCNNavigationMenuViewport.displayName

const NavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof ShadCNNavigationMenuTrigger>,
  React.ComponentPropsWithoutRef<typeof ShadCNNavigationMenuTrigger>
>(({ children, className, ...props }, ref) => {
  return (
    <ShadCNNavigationMenuTrigger
      ref={ref}
      className={cn('bg-transparent', className)}
      {...props}
    >
      {children}
    </ShadCNNavigationMenuTrigger>
  )
})
NavigationMenuTrigger.displayName = ShadCNNavigationMenuTrigger.displayName

const NavigationMenuLink = React.forwardRef<
  React.ComponentRef<typeof ShadCNNavigationMenuLink>,
  React.ComponentPropsWithoutRef<typeof ShadCNNavigationMenuLink>
>(({ children, className, ...props }, ref) => {
  return (
    <ShadCNNavigationMenuLink
      ref={ref}
      className={cn(navigationMenuTriggerStyle(), 'bg-transparent', className)}
      {...props}
    >
      {children}
    </ShadCNNavigationMenuLink>
  )
})
NavigationMenuLink.displayName = ShadCNNavigationMenuLink.displayName

const NavigationMenuSubItem = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group relative flex h-14 cursor-pointer select-none flex-col items-start justify-center gap-0 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-primary/10 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
      className
    )}
    {...props}
  >
    {children}
    <div className="absolute right-2 -translate-x-2 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 [&>svg]:size-4">
      <ChevronRightIcon />
    </div>
  </div>
))
NavigationMenuSubItem.displayName = 'NavigationMenuSubItem'

const NavigationMenuSubItemIcon = React.forwardRef<
  React.ElementRef<'span'>,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'absolute left-2 mr-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground [&>svg]:size-5',
      className
    )}
    {...props}
  >
    {children}
  </span>
))
NavigationMenuSubItemIcon.displayName = 'NavigationMenuSubItemIcon'

const NavigationMenuSubItemTitle = React.forwardRef<
  React.ElementRef<'h3'>,
  React.ComponentPropsWithoutRef<'h3'>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'pl-12 text-sm font-medium transition-colors duration-200 group-hover:text-primary',
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
NavigationMenuSubItemTitle.displayName = 'NavigationMenuSubItemTitle'

const NavigationMenuSubItemDescription = React.forwardRef<
  React.ElementRef<'p'>,
  React.ComponentPropsWithoutRef<'p'>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'pl-12 text-xs text-muted-foreground transition-colors duration-200 group-hover:text-primary',
      className
    )}
    {...props}
  >
    {children}
  </p>
))
NavigationMenuSubItemDescription.displayName =
  'NavigationMenuSubItemDescription'

export {
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuSubItem,
  NavigationMenuSubItemIcon,
  NavigationMenuSubItemTitle,
  NavigationMenuSubItemDescription,
}
