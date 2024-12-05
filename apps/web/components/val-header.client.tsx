'use client'
'use client'

import type React from 'react'
import { motion } from 'motion/react'

import { cn } from '@valhalla/design-system/utils/cn'

import { useIsTop } from '@/hooks/use-is-top'
import { useScrollDir } from '@/hooks/use-scroll-dir'

interface HeaderWrapperProps {
  children: React.ReactNode
  type?: 'hide' | 'shadow'
}

const HeaderWrapper = ({ children, type = 'hide' }: HeaderWrapperProps) => {
  const isTop = useIsTop()
  const scrollDir = useScrollDir()

  const variants = {
    hideOnScroll: {
      y: scrollDir === 'up' ? 0 : -100,
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
  }

  return (
    <motion.header
      className={cn(
        'fixed inset-x-0 top-0 z-50 mx-auto flex h-12 max-w-5xl items-center bg-card px-4 text-card-foreground transition-shadow duration-200 md:top-2 md:rounded-lg',
        type === 'shadow' && !isTop && 'shadow-md backdrop-blur-sm'
      )}
      animate={type === 'hide' ? variants.hideOnScroll : undefined}
    >
      {children}
    </motion.header>
  )
}

export { HeaderWrapper }
