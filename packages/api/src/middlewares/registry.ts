import { getRegistry } from '@valhalla/core/resource'

import { authed } from '@/orpc'
import { MatchLayoutInput } from '@/schemas'

export const registryMiddleware = authed.middleware((_input, _ctx, meta) => {
  return meta.next({
    context: {
      registry: getRegistry(),
      // ownedResources: getOwnedResources(context.user?.id),
    },
  })
})

export const layoutsMiddleware = registryMiddleware.concat(
  (_input, ctx, meta) => {
    return meta.next({
      context: {
        ...ctx,
        layouts: getRegistry().layouts,
        resourceLayouts: getRegistry().resourceLayouts,
      },
    })
  }
)

export const matchLayoutMiddleware = layoutsMiddleware.concat(
  (input: MatchLayoutInput, ctx, meta) => {
    const resourceLayouts = ctx.resourceLayouts[input.resourceName]
    const layouts = [...ctx.layouts, ...resourceLayouts].sort(
      (a, b) => b.priority - a.priority
    )
    const matchLayout = layouts.find((layout) => layout.match(input))

    return meta.next({
      context: {
        ...ctx,
        matchLayout,
      },
    })
  }
)
