'use client'

import { useEffect, useState } from 'react'
import ky from 'ky'
import { UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@valhalla/ui/avatar'

interface UserAvatarProps extends React.ComponentProps<typeof Avatar> {
  src?: string
}

const ValhallaUserAvatar = ({ src, ...props }: UserAvatarProps) => {
  const [base64Src, setBase64Src] = useState<string>()

  useEffect(() => {
    const fetchImage = async () => {
      if (!src) return

      try {
        const blob = await ky
          .get(src, {
            next: {
              tags: ['avatar'],
            },
          })
          .blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          setBase64Src(reader.result as string)
        }
        reader.readAsDataURL(blob)
      } catch (error) {
        console.error('获取头像失败:', error)
      }
    }

    fetchImage()
  }, [src])

  return (
    <Avatar {...props}>
      <AvatarFallback>
        <UserIcon className="size-4" />
      </AvatarFallback>
      <AvatarImage src={base64Src} />
    </Avatar>
  )
}

export { ValhallaUserAvatar }
