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
          toast.success('Logged out successfully. Redirecting to login page.')
          router.push('/sign-in')
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
