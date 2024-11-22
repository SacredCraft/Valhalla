'use client'

import { useState } from 'react'

import { Session } from '@valhalla/auth'
import { Button } from '@valhalla/ui/button'
import { Input } from '@valhalla/ui/input'
import { Label } from '@valhalla/ui/label'
import { toast } from '@valhalla/ui/sonner'

import { authClient } from '@/lib/auth/client'
import { orpc } from '@/lib/orpc/react'

import {
  AvatarUploader,
  AvatarUploaderButton,
  AvatarUploaderDescription,
  AvatarUploaderDisplay,
} from './ui/avatar-uploader'

const ValUserProfile = ({ session }: { session: Session }) => {
  const [avatar, setAvatar] = useState<File | null>(null)
  const [name, setName] = useState(session.user.name)

  const { data: image } = orpc.avatar.get.useQuery({ userId: session.user.id })
  const utils = orpc.useUtils()

  const imageUrl = image
    ? `data:image/jpeg;base64,${Buffer.from(image).toString('base64')}`
    : undefined

  const { mutateAsync } = orpc.avatar.upload.useMutation({
    onSuccess: async () => {
      authClient.updateUser({
        name,
      })
      utils.avatar.get.invalidate()
      toast.success('更新成功')
    },
  })

  const handleSubmit = async () => {
    if (!avatar) {
      return
    }
    await mutateAsync({ avatar, userId: session.user.id })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">个人资料</h2>
      </div>

      <div className="space-y-6">
        <AvatarUploader
          className="py-4"
          src={imageUrl}
          avatar={avatar}
          setAvatar={setAvatar}
        >
          <AvatarUploaderDisplay />
          <AvatarUploaderButton>上传头像</AvatarUploaderButton>
          <AvatarUploaderDescription>
            或将图片拖放到此处
          </AvatarUploaderDescription>
        </AvatarUploader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">用户名</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              defaultValue={session.user.email}
              disabled
            />
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            保存更改
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ValUserProfile }
