import type React from 'react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import './globals.css'

import { Toaster } from '@valhalla/design-system/components/ui/sonner'

import { ORPCProvider } from '@/lib/orpc/react'

export const metadata: Metadata = {
  title: 'Valhalla - 开拓者资源管理中心',
  description: '开拓者资源管理中心',
}

const geistSans = localFont({
  src: '../../../packages/assets/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: '../../../packages/assets/fonts/GeistVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${geistSans.variable} antialiased`}
      >
        <NuqsAdapter>
          <ORPCProvider>{children}</ORPCProvider>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  )
}
