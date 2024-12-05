'use client'

import type React from 'react'
import { motion } from 'motion/react'

import { cn } from '@valhalla/design-system/utils/cn'

interface valhallaAuthCardProps
  extends React.ComponentPropsWithoutRef<typeof motion.div> {
  children: React.ReactNode
  className?: string
}

const ValhallaAuthCard: React.FC<valhallaAuthCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.div
      className={cn('bg-card text-card-foreground shadow', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { ValhallaAuthCard }
