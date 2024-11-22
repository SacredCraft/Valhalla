import { ORPCError } from '@orpc/server'

import { authed } from '@/orpc'

export const permissionMiddleware = (role: string) =>
  authed.middleware((_input, context, meta) => {
    if (context.user.role !== role) {
      throw new ORPCError({
        code: 'FORBIDDEN',
        message: 'Permission denied',
      })
    }

    return meta.next({})
  })
