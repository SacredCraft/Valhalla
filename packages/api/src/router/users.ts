import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import { auth, hashPassword } from '@valhalla/auth'
import { eq, inArray } from '@valhalla/db'
import {
  account,
  notification,
  notificationRecipients,
  session,
  user,
} from '@valhalla/db/schema'

import { admin } from '@/orpc'

import { uploadAvatar } from './avatar'
import { createUserSchema, updateUserSchema } from './users.schemas'

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

  banUsers: admin
    .input(
      z.object({
        ids: z.array(z.string()),
        reason: z.string().optional(),
        expiresAt: z.date().optional(),
      })
    )
    .func(async (input, ctx) => {
      let containsSelf = false

      if (input.ids.includes(ctx.user.id)) {
        containsSelf = true
      }

      const ids = input.ids.filter((id) => id !== ctx.user.id)
      await ctx.db
        .update(user)
        .set({
          banned: true,
          banReason: input.reason,
          banExpires: input.expiresAt,
        })
        .where(inArray(user.id, ids))
        .execute()

      if (containsSelf) {
        throw new ORPCError({
          code: 'BAD_REQUEST',
          message: '不能封禁自己',
        })
      }
    }),

  unbanUsers: admin
    .input(z.object({ ids: z.array(z.string()) }))
    .func(async (input, ctx) => {
      await ctx.db
        .update(user)
        .set({
          banned: false,
        })
        .where(inArray(user.id, input.ids))
        .execute()
    }),

  updateUser: admin.input(updateUserSchema).func(async (input, ctx) => {
    await ctx.db
      .update(user)
      .set({
        name: input.name,
        email: input.email,
        role: input.role,
      })
      .where(eq(user.id, input.id))
      .execute()

    if (input.password && input.password.length > 0) {
      await changePassword({
        userId: input.id,
        password: input.password,
        revokeOtherSessions: true,
      })
    }

    if (input.image) {
      await uploadAvatar({ avatar: input.image, userId: input.id })
    }
  }),
})

export const changePassword = admin
  .input(
    z.object({
      userId: z.string(),
      password: z.string().min(8, '密码至少8位'),
      revokeOtherSessions: z.boolean().optional(),
    })
  )
  .func(async (input, ctx) => {
    const accounts = await ctx.db
      .select()
      .from(account)
      .where(eq(account.userId, input.userId))
      .execute()

    const credentialAccount = accounts.find(
      (account) => account.providerId === 'credential' && account.password
    )

    if (!credentialAccount) {
      throw new ORPCError({
        code: 'BAD_REQUEST',
        message: '没有绑定邮箱',
      })
    }

    const passwordHash = await hashPassword(input.password)

    await ctx.db
      .update(account)
      .set({
        password: passwordHash,
      })
      .where(eq(account.id, credentialAccount.id))
      .execute()

    if (input.revokeOtherSessions) {
      await ctx.db
        .delete(session)
        .where(eq(session.userId, input.userId))
        .execute()
    }
  })
