import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { auth } from '@valhalla/auth'
import { db } from '@valhalla/db'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const originalSession = await auth.api.getSession({
    headers: opts.headers,
  })

  const user = originalSession?.user
  const session = originalSession?.session

  return {
    db,
    session,
    user,
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})
export const createCallerFactory = t.createCallerFactory

export const createRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      session: { ...ctx.session },
      user: { ...ctx.user },
    },
  })
})
