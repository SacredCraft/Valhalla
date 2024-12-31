import { randomUUID } from 'crypto'
import { z } from 'zod'

import { registryMiddleware } from '@valhalla/api/middlewares/registry'
import { admin, authed } from '@valhalla/api/orpc'
import { eq, inArray } from '@valhalla/db'
import {
  resourceRole,
  resourceRoleResource,
  userResourceRole,
} from '@valhalla/db/schema'

import { createRoleSchema, updateRoleSchema } from './resources.schemas'

export const getResources = authed
  .use(registryMiddleware)
  .route({
    method: 'GET',
    path: '/list',
    summary: '列出资源',
  })
  .input(
    z.object({
      search: z.string().optional(),
    })
  )
  .func(async (input, ctx) => {
    return ctx.resources.filter((resource) => {
      if (input.search) {
        return resource.name.includes(input.search)
      }
      return true
    })
  })

export const getOwnedResources = authed
  .use(registryMiddleware)
  .func(async (input, ctx) => {
    return ctx.ownedResources
  })

export const resourcesRouter = authed
  .tags('Resources')
  .prefix('/resources')
  .router({
    get: authed
      .use(registryMiddleware)
      .input(
        z.object({
          name: z.string(),
        })
      )
      .func(async (input, ctx) => {
        return ctx.registry.resources[input.name]
      }),

    list: getResources,

    owned: getOwnedResources,

    folders: authed
      .use(registryMiddleware)
      .route({
        method: 'GET',
        path: '/folders',
        summary: '列出资源文件夹',
      })
      .input(
        z.object({
          name: z.string(),
        })
      )
      .func((input, ctx) => {
        return ctx.registry.resourcesFolders[input.name].map((folder) => ({
          name: folder.name,
        }))
      }),

    roles: admin
      .route({
        method: 'GET',
        path: '/roles',
        summary: '列出角色',
      })
      .func(async (input, ctx) => {
        const roles = await ctx.db.select().from(resourceRole)

        // 为每个角色获取关联的用户和资源
        const rolesWithDetails = await Promise.all(
          roles.map(async (role) => {
            const users = await ctx.db
              .select()
              .from(userResourceRole)
              .where(eq(userResourceRole.resourceRoleId, role.id))

            const resources = await ctx.db
              .select()
              .from(resourceRoleResource)
              .where(eq(resourceRoleResource.resourceRoleId, role.id))

            return {
              ...role,
              users: users.map((u) => u.userId),
              resources: resources.map((r) => r.resourceName),
            }
          })
        )

        return rolesWithDetails
      }),

    createRole: admin
      .route({
        method: 'POST',
        path: '/roles',
        summary: '创建角色',
      })
      .input(createRoleSchema)
      .func(async (input, ctx) => {
        const roleId = randomUUID()

        // 事务处理确保数据一致性
        return await ctx.db.transaction(async (tx) => {
          // 插入角色主表
          await tx.insert(resourceRole).values({
            id: roleId,
            name: input.name,
            description: input.description,
          })

          // 插入资源关联表
          if (input.resources.length > 0) {
            await tx.insert(resourceRoleResource).values(
              input.resources.map((resourceId) => ({
                resourceRoleId: roleId,
                resourceName: resourceId,
              }))
            )
          }

          // 插入用户关联表
          if (input.users.length > 0) {
            await tx.insert(userResourceRole).values(
              input.users.map((userId) => ({
                resourceRoleId: roleId,
                userId,
              }))
            )
          }

          return { id: roleId }
        })
      }),

    deleteRoles: admin
      .route({
        method: 'DELETE',
        path: '/roles',
        summary: '删除角色',
      })
      .input(z.object({ ids: z.array(z.string()) }))
      .func(async (input, ctx) => {
        return ctx.db
          .delete(resourceRole)
          .where(inArray(resourceRole.id, input.ids))
      }),

    updateRole: admin.input(updateRoleSchema).func((input, ctx) => {
      return ctx.db.transaction(async (tx) => {
        await tx
          .update(resourceRole)
          .set({
            name: input.name,
            description: input.description,
          })
          .where(eq(resourceRole.id, input.id))
          .execute()

        // 更新资源关联表
        await tx
          .delete(resourceRoleResource)
          .where(eq(resourceRoleResource.resourceRoleId, input.id))
          .execute()

        if ((input.resources?.length ?? 0) > 0) {
          await tx
            .insert(resourceRoleResource)
            .values(
              input.resources?.map((resource) => ({
                resourceRoleId: input.id,
                resourceName: resource,
              })) ?? []
            )
            .execute()
        }

        // 更新用户关联表
        await tx
          .delete(userResourceRole)
          .where(eq(userResourceRole.resourceRoleId, input.id))
          .execute()

        if ((input.users?.length ?? 0) > 0) {
          await tx
            .insert(userResourceRole)
            .values(
              input.users?.map((user) => ({
                resourceRoleId: input.id,
                userId: user,
              })) ?? []
            )
            .execute()
        }
      })
    }),
  })
