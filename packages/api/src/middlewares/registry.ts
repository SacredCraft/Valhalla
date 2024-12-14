import { authed } from '@valhalla/api/orpc'
import { MatchLayoutInput } from '@valhalla/api/schemas'
import { getRegistry } from '@valhalla/core/resource'

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
    const resourceConfig = ctx.registry.resourcesConfigs[input.resourceName]
    const resourceLayouts = ctx.resourceLayouts[input.resourceName]
    const layouts = [...ctx.layouts, ...resourceLayouts].sort(
      (a, b) => b.priority - a.priority
    )
    const matchLayout =
      layouts.find((layout) => layout.match(input, resourceConfig)) ?? null

    return meta.next({
      context: {
        ...ctx,
        matchLayout,
      },
    })
  }
)
