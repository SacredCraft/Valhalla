import { useState } from 'react'

const useDoubleClick = ({ delay = 300 }: { delay?: number }) => {
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)

  const handleClick = (callback: () => void) => {
    const currentTime = new Date().getTime()

    if (clickCount === 1 && currentTime - lastClickTime < delay) {
      setClickCount(0)
      callback()
    } else {
      setClickCount(1)
      setLastClickTime(currentTime)

      setTimeout(() => {
        setClickCount(0)
      }, delay)
    }
  }

  return handleClick
}

export { useDoubleClick }
