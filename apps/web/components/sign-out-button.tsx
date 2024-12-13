'use client'

import type React from 'react'
import { useRouter } from 'next/navigation'
import { Slot } from '@radix-ui/react-slot'

import { toast } from '@valhalla/design-system/components/ui/sonner'

import { authClient } from '@/lib/auth/client'

export const SignOutButton = ({
  children = 'Logout',
  asChild,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { asChild?: boolean }) => {
  const router = useRouter()
  const Comp = asChild ? Slot : 'div'
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('成功登出。正在重定向到登录页面。')
          router.push('/')
          router.refresh()
        },
      },
    })
  }

  return (
    <Comp onClick={handleSignOut} {...props}>
      {children}
    </Comp>
  )
}
