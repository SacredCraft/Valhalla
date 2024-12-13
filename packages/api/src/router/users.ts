import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import { auth } from '@valhalla/auth'
import { eq, inArray } from '@valhalla/db'
import {
  account,
  notification,
  notificationRecipients,
  session,
  user,
} from '@valhalla/db/schema'

import { admin } from '@/orpc'

import { createUserSchema } from './users.schemas'

export const usersRouter = admin.router({
  list: admin.func(async (input, ctx) => {
    return await ctx.db.select().from(user).execute()
  }),

  deleteUsers: admin
    .input(z.object({ ids: z.array(z.string()) }))
    .func(async (input, ctx) => {
      let containsSelf = false

      if (input.ids.includes(ctx.user.id)) {
        containsSelf = true
      }

      try {
        const ids = input.ids.filter((id) => id !== ctx.user.id)
        await ctx.db.transaction(async (tx) => {
          await tx.delete(session).where(inArray(session.userId, ids)).execute()
          await tx.delete(account).where(inArray(account.userId, ids)).execute()
          await tx
            .delete(notificationRecipients)
            .where(inArray(notificationRecipients.userId, ids))
            .execute()
          await tx
            .delete(notification)
            .where(inArray(notification.recipientId, ids))
            .execute()
          await tx.delete(user).where(inArray(user.id, ids)).execute()
        })
      } catch {
        throw new ORPCError({
          code: 'BAD_REQUEST',
          message: '删除失败',
        })
      }

      if (containsSelf) {
        throw new ORPCError({
          code: 'BAD_REQUEST',
          message: '不能删除自己',
        })
      }
    }),

  createUser: admin.input(createUserSchema).func(async (input, ctx) => {
    const res = await auth.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: input.name,
        role: input.role,
      },
    })

    if (input.role === 'admin') {
      await ctx.db
        .update(user)
        .set({
          role: 'admin',
        })
        .where(eq(user.id, res.id))
        .execute()
    }
  }),
})
