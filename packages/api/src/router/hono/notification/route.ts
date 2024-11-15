import { Handler } from 'hono'

import { db } from '@valhalla/db'
import { notification } from '@valhalla/db/schema'

import type { RouteConfig } from '../index'
import { adminOnly, AdminOnlyEnv } from '../middlewares/admin-only'
import { authedOnly, AuthedOnlyEnv } from '../middlewares/authed-only'

export const config = {
  middlewares: [authedOnly, adminOnly],
} satisfies RouteConfig

const GET: Handler<AuthedOnlyEnv & AdminOnlyEnv> = async (c) => {
  const user = c.get('user')

  await db.insert(notification).values({
    id: crypto.randomUUID(),
    recipientId: user.id,
    data: {
      title: 'Test Notification',
      content: 'This is a test notification',
    },
    type: 'System',
  })

  return c.json({ message: 'Hello, World!' })
}

export { GET }
