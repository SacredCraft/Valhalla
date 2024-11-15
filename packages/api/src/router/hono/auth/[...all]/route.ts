import { Handler } from 'hono'

import { auth } from '@valhalla/auth'

const handler: Handler = async (c) => {
  return auth.handler(c.req.raw)
}

export { handler as GET, handler as POST }
