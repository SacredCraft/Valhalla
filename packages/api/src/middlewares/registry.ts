import { authed } from '@valhalla/api/orpc'
import { MatchLayoutInput } from '@valhalla/api/schemas'
import { getRegistry } from '@valhalla/core/resource'
import { eq, inArray } from '@valhalla/db'
import { resourceRoleResource, userResourceRole } from '@valhalla/db/schema'

export const registryMiddleware = authed.middleware(
  async (_input, ctx, meta) => {
    const registry = getRegistry()
    const resources = Object.values(registry.resources)
    const userResourceRoles = await ctx.db
      .select()
      .from(userResourceRole)
      .where(eq(userResourceRole.userId, ctx.user?.id))

    const resourceIds = userResourceRoles.map((role) => role.resourceRoleId)

    const resourceRoleResources = await ctx.db
      .select()
      .from(resourceRoleResource)
      .where(inArray(resourceRoleResource.resourceRoleId, resourceIds))

    let ownedResources = resources.filter((resource) =>
      resourceRoleResources.some((role) => role.resourceName === resource.name)
    )

    if (ctx.user.role === 'admin') {
      ownedResources = resources
    }

    return meta.next({
      context: {
        registry,
        resources,
        ownedResources,
      },
    })
  }
)

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

    const icon = matchLayout?.icon
      ? matchLayout.icon(input, resourceConfig)
      : 'File'

    return meta.next({
      context: {
        ...ctx,
        matchLayout,
        icon,
      },
    })
  }
)
