import { z } from 'zod'

import { authed } from '@valhalla/api/orpc'
import { and, desc, eq, isNull } from '@valhalla/db'
import { notification } from '@valhalla/db/schema'

export const notificationsRouter = authed
  .tags('Notifications')
  .prefix('/notifications')
  .router({
    list: authed
      .route({
        method: 'GET',
        path: '/list',
        summary: '列出通知',
      })
      .func(async (_, ctx) => {
        return await ctx.db.query.notification.findMany({
          where: eq(notification.recipientId, ctx.user.id),
          orderBy: [desc(notification.createdAt)],
        })
      }),

    read: authed
      .route({
        method: 'POST',
        path: '/read',
        summary: '标记通知为已读',
      })
      .input(z.object({ id: z.string() }))
      .func(async (input, ctx) => {
        await ctx.db
          .update(notification)
          .set({ readAt: new Date() })
          .where(eq(notification.id, input.id))
      }),

    hasUnread: authed
      .route({
        method: 'GET',
        path: '/has-unread',
        summary: '检查是否有未读通知',
      })
      .func(async (_, ctx) => {
        const [unread] = await ctx.db
          .select()
          .from(notification)
          .where(
            and(
              eq(notification.recipientId, ctx.user.id),
              isNull(notification.readAt)
            )
          )
        return !!unread
      }),
  })
