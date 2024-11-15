import { createMiddleware } from 'hono/factory'

import { auth, Session } from '@valhalla/auth'

export type AuthedOnlyEnv = {
  Variables: {
    session: Session
    user: Session['user']
  }
}

export const authedOnly = createMiddleware<AuthedOnlyEnv>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ message: 'Unauthorized' }, 401)
  }

  c.set('session', session)
  c.set('user', session.user)

  return next()
})
