import { createCallerFactory, createRouter } from '@/trpc'

import { notificationsRouter } from './notifications'
import { sponsorsRouter } from './sponsors'

export const appRouter = createRouter({
  sponsors: sponsorsRouter,
  notifications: notificationsRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)

export { createTRPCContext } from '@/trpc'

export type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
