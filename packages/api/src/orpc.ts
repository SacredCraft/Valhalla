import { headers } from 'next/headers'
import { ORPCError, os } from '@orpc/server'

import { auth, Session } from '@valhalla/auth'
import { db } from '@valhalla/db'

export type ORPCContext = {
  session?: Session['session']
  user?: Session['user']
  db: typeof db
}

export const pub = os.use(async (_input, context, meta) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return meta.next({
    context: {
      ...context,
      db,
      session: session?.session,
      user: session?.user,
    },
  })
})

export const authed = pub.use((_input, context, meta) => {
  if (!context.session || !context.user) {
    throw new ORPCError({
      code: 'UNAUTHORIZED',
    })
  }

  return meta.next({
    context: {
      ...context,
      session: context.session,
      user: context.user,
    },
  })
})
