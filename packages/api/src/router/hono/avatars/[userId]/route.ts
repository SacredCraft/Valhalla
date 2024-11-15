import fs from 'fs-extra'
import { Handler } from 'hono'

import { systemConfig } from '@valhalla/core/config'
import { resolvePath } from '@valhalla/utils/path'

const GET: Handler = async (c) => {
  const userId = c.req.param('userId')

  const avatarConfig = systemConfig.users.avatar
  const avatarPath = resolvePath(avatarConfig.path, `${userId}.jpg`)

  const fileBuffer = await fs.readFile(avatarPath)

  return c.newResponse(fileBuffer, 200, {
    'Content-Type': 'image/jpeg',
  })
}

export { GET }
