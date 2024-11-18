import { z } from 'zod'

import { and, desc, eq, isNull } from '@valhalla/db'
import { notification } from '@valhalla/db/schema'

import { createRouter, protectedProcedure } from './trpc'

const notificationsRouter = createRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.notification.findMany({
      where: eq(notification.recipientId, ctx.user.id),
      orderBy: [desc(notification.createdAt)],
    })
  }),

  read: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(notification)
        .set({ readAt: new Date() })
        .where(eq(notification.id, input.id))
    }),

  hasUnread: protectedProcedure.query(async ({ ctx }) => {
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

export { notificationsRouter }
