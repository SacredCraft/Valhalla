'use client'

import type React from 'react'
import { cn } from '@valhalla/ui/cn'
import { motion } from 'framer-motion'

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