import type React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-primary/10">
      {children}
    </main>
  )
}
