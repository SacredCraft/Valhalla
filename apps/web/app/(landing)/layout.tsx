import type React from 'react'

import { ValhallaSmoothScroll } from '@/components/ui/val-smooth-scroll'
import { ValhallaFooter } from '@/components/val-footer'
import { ValhallaHeader } from '@/components/val-header'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ValhallaSmoothScroll>
      <ValhallaHeader />
      {children}
      <ValhallaFooter />
    </ValhallaSmoothScroll>
  )
}
