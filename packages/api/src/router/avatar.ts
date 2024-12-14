import path from 'path'
import { revalidateTag } from 'next/cache'
import { ORPCError } from '@orpc/server'
import { oz } from '@orpc/zod'
import fs from 'fs-extra'
import sharp from 'sharp'
import { z } from 'zod'

import { systemConfig } from '@valhalla/core/config'
import { eq } from '@valhalla/db'
import { user as userSchema } from '@valhalla/db/schema'
import { resolvePath } from '@valhalla/utils/path'

import { authed } from '../orpc'

export const uploadAvatar = authed
  .route({
    method: 'POST',
    path: '/',
    summary: '上传头像',
  })
  .input(
    z.object({
      avatar: oz.file().type('image/*'),
      userId: z.string(),
    })
  )
  .func(async (input, ctx) => {
    const user = ctx.user

    if (user.role !== 'admin' && input.userId !== user.id) {
      throw new ORPCError({
        code: 'FORBIDDEN',
        message: 'You are not allowed to upload avatar for other users',
      })
    }

    const dbUser = await ctx.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, input.userId))
      .then(([user]) => user)

    const avatarConfig = systemConfig.users.avatar
    if (dbUser.image) {
      const oldAvatarPath = resolvePath(avatarConfig.path)
      if (await fs.pathExists(oldAvatarPath)) {
        await fs.remove(oldAvatarPath)
      }
    }

    const avatarPath = resolvePath(avatarConfig.path, `${input.userId}.jpg`)

    await fs.ensureDir(path.dirname(avatarPath))

    const buffer = await input.avatar.arrayBuffer()

    await sharp(buffer)
      .resize(avatarConfig.width, avatarConfig.height)
      .jpeg({ quality: avatarConfig.quality })
      .toFile(avatarPath)

    await ctx.db
      .update(userSchema)
      .set({ image: `/api/avatars/${input.userId}` })
      .where(eq(userSchema.id, input.userId))

    revalidateTag('avatar')

    return { success: true }
  })

export const avatarRouter = authed
  .tags('Avatar')
  .prefix('/avatars')
  .router({
    upload: uploadAvatar,

    get: authed
      .route({
        method: 'GET',
        path: '/{userId}',
        summary: '获取头像',
      })
      .input(z.object({ userId: z.string() }))
      .func(async (input) => {
        const userId = input.userId
        const avatarConfig = systemConfig.users.avatar
        const avatarPath = resolvePath(avatarConfig.path, `${userId}.jpg`)

        const fileBuffer = await fs.readFile(avatarPath)

        return fileBuffer
      }),
  })
