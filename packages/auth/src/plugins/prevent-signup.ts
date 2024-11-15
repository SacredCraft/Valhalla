import { BetterAuthPlugin } from 'better-auth'

import { db } from '@valhalla/db'

const preventSignup: BetterAuthPlugin = {
  id: 'prevent-singup',
  onRequest: async (req) => {
    if (req.url.includes('sign-up')) {
      const users = await db.query.user.findMany()

      if (users.length > 0) {
        return {
          response: Response.json(
            {
              message: 'Failed to create user',
              details: {
                status: 'BAD_REQUEST',
                headers: {},
                body: {
                  message: 'Only admins can create users',
                },
                name: 'BetterCallAPIError',
              },
            },
            { status: 422 }
          ),
        }
      }
    }
  },
} satisfies BetterAuthPlugin

export { preventSignup }
