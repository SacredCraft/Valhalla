import { getRegistry } from '@valhalla/core/resource'

import { createRouter, publicProcedure } from './trpc'

const resourceRouter = createRouter({
  example: publicProcedure.query(() => {
    return getRegistry().resources
  }),
})

export { resourceRouter }
