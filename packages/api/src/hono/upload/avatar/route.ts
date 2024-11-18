import path from 'path'
import { revalidateTag } from 'next/cache'
import fs from 'fs-extra'
import { Handler } from 'hono'
import sharp from 'sharp'

import { auth } from '@valhalla/auth'
import { systemConfig } from '@valhalla/core/config'
import { db, eq } from '@valhalla/db'
import { user } from '@valhalla/db/schema'
import { resolvePath } from '@valhalla/utils/path'

const POST: Handler = async (c) => {
  const session = await auth.api.getSession({
    headers: new Headers(c.req.header()),
  })

  if (!session?.user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const userId = session.user.id

  const file = await c.req.parseBody()

  if (!file.avatar) {
    return c.json({ error: 'No avatar file provided' }, 400)
  }

  if (session.user.role !== 'admin' && userId !== session.user.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .then(([user]) => user)

  const avatarConfig = systemConfig.users.avatar
  if (dbUser.image) {
    const oldAvatarPath = resolvePath(avatarConfig.path)
    if (await fs.pathExists(oldAvatarPath)) {
      await fs.remove(oldAvatarPath)
    }
  }

  const uuid = crypto.randomUUID()
  const avatarPath = resolvePath(avatarConfig.path, `${uuid}.jpg`)

  await fs.ensureDir(path.dirname(avatarPath))

  let buffer: ArrayBuffer

  if (typeof file.avatar === 'string') {
    buffer = await fs.readFile(file.avatar)
  } else {
    buffer = await file.avatar.arrayBuffer()
  }

  await sharp(buffer)
    .resize(avatarConfig.width, avatarConfig.height)
    .jpeg({ quality: avatarConfig.quality })
    .toFile(avatarPath)

  await db
    .update(user)
    .set({ image: `/api/avatars/${uuid}` })
    .where(eq(user.id, userId))

  revalidateTag('avatar')

  return c.json({ success: true })
}

export { POST }
