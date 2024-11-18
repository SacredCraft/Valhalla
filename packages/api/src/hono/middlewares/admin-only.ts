import { createMiddleware } from 'hono/factory'

type AdminOnlyEnv = {
  Variables: {
    user: {
      role: 'admin' | 'user'
    }
  }
}

const adminOnly = createMiddleware<AdminOnlyEnv>(async (c, next) => {
  const user = c.get('user')
  if (user.role !== 'admin') {
    return c.json(
      {
        error: 'Forbidden',
        message: 'You are not allowed to access this resource',
      },
      403
    )
  }
  await next()
})

export { adminOnly }

export type { AdminOnlyEnv }
