import { getRegistry } from '@valhalla/core/resource'

import { pub } from '../orpc'

export const registryMiddleware = pub.middleware((_input, context, meta) => {
  return meta.next({
    context: {
      ...context,
      registry: getRegistry(),
      // ownedResources: getOwnedResources(context.user?.id),
    },
  })
})
