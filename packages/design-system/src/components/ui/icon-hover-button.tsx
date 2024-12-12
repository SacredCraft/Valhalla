'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { Button } from '@valhalla/design-system/components/ui/button'
import { cn } from '@valhalla/design-system/utils/cn'
import { createContext } from '@valhalla/design-system/utils/context'

const IconHoverButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, children, ...props }, ref) => {
  const [isHover, setIsHover] = React.useState(false)

  return (
    <IconHoverButtonProvider value={{ isHover }}>
      <Button
        ref={ref}
        className={cn('gap-0 px-2.5 min-w-9', className)}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        {...props}
      >
        {children}
      </Button>
    </IconHoverButtonProvider>
  )
})
IconHoverButton.displayName = 'IconHoverButton'

const IconHoverButtonIcon = React.forwardRef<
  React.ComponentRef<'span'>,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={className} {...props} />
))
IconHoverButtonIcon.displayName = 'IconHoverButtonIcon'

const IconHoverButtonText = React.forwardRef<
  React.ComponentRef<typeof motion.div>,
  React.ComponentPropsWithoutRef<typeof motion.div> & {
    children?: React.ReactNode
    spanClassName?: string
  }
>(({ className, spanClassName, children, ...props }, ref) => {
  const { isHover } = useIconHoverButtonContext()

  const variants = {
    initial: {
      width: 0,
      opacity: 0,
    },
    animate: { width: 'auto', opacity: 1 },
  }

  return (
    <AnimatePresence>
      {isHover && (
        <motion.div
          ref={ref}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="initial"
          transition={{ duration: 0.4, type: 'spring', bounce: 0 }}
          className={cn('overflow-hidden', className)}
          {...props}
        >
          <span className={cn('ml-1', spanClassName)}>{children}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
IconHoverButtonText.displayName = 'IconHoverButtonText'

interface ButtonContextValue {
  isHover: boolean
}

const [IconHoverButtonProvider, useIconHoverButtonContext] =
  createContext<ButtonContextValue>({
    isHover: false,
  })

export { IconHoverButton, IconHoverButtonIcon, IconHoverButtonText }
export { useIconHoverButtonContext }
