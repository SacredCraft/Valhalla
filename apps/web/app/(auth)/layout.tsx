import type React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@valhalla/auth'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    return redirect('/dashboard')
  }

  return (
    <main className="relative flex h-svh items-center justify-center bg-[url('/auth-background.jpg?height=1080&width=1920')] bg-cover bg-center">
      {children}
    </main>
  )
}
