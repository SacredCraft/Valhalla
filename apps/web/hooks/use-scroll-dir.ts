import { useEffect, useState } from 'react'

const useScrollDir = () => {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up')

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateScrollDir = () => {
      const scrollY = window.scrollY
      const direction = scrollY > lastScrollY ? 'down' : 'up'

      if (direction !== scrollDir) {
        setScrollDir(direction)
      }

      lastScrollY = scrollY > 0 ? scrollY : 0
    }

    const onScroll = () => {
      window.requestAnimationFrame(updateScrollDir)
    }

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollDir])

  return scrollDir
}

export { useScrollDir }
