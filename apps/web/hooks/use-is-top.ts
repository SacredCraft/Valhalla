'use client'

import { useEffect, useState } from 'react'

const useIsTop = () => {
  const [isTop, setIsTop] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setIsTop(position === 0)
    }

    window.addEventListener('scroll', handleScroll)

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return isTop
}

export { useIsTop }
