import { notificationsRouter } from './notifications'
import { resourceRouter } from './resouces'
import { sponsorsRouter } from './sponsors'
import { createCallerFactory, createRouter } from './trpc'

export const appRouter = createRouter({
  sponsors: sponsorsRouter,
  notifications: notificationsRouter,
  resources: resourceRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)

export { createTRPCContext } from './trpc'

export type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
