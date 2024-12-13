'use client'

import type React from 'react'
import { motion } from 'motion/react'

import { cn } from '@valhalla/design-system/utils/cn'

interface ValhallaAuthCardProps
  extends React.ComponentPropsWithoutRef<typeof motion.div> {
  children: React.ReactNode
  className?: string
}

const ValhallaAuthCard: React.FC<ValhallaAuthCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        'ml-auto w-full bg-card text-card-foreground shadow sm:w-1/2',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { ValhallaAuthCard }
