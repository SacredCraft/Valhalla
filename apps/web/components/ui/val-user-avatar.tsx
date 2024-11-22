'use client'

import { useEffect, useState } from 'react'
import ky from 'ky'
import { UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@valhalla/ui/avatar'

import { orpc } from '@/lib/orpc/react'

interface UserAvatarProps extends React.ComponentProps<typeof Avatar> {
  userId: string
}

const ValhallaUserAvatar = ({ userId, ...props }: UserAvatarProps) => {
  const { data } = orpc.avatar.get.useQuery({ userId })

  // 将 Buffer 转换为 base64 字符串
  const imageUrl = data
    ? `data:image/jpeg;base64,${Buffer.from(data).toString('base64')}`
    : undefined

  return (
    <Avatar {...props}>
      <AvatarFallback>
        <UserIcon className="size-4" />
      </AvatarFallback>
      <AvatarImage src={imageUrl} />
    </Avatar>
  )
}

export { ValhallaUserAvatar }
