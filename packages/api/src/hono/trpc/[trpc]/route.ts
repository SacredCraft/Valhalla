import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { Handler } from 'hono'

import { appRouter, createTRPCContext } from '../../../trpc'

const handler: Handler = async (c) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => createTRPCContext(c.req.raw),
    onError: ({ path, error }) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
        )
      }
    },
  })
}

export { handler as POST, handler as GET }
