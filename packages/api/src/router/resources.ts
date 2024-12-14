import { z } from 'zod'

import { registryMiddleware } from '@valhalla/api/middlewares/registry'
import { authed } from '@valhalla/api/orpc'

export const getResources = authed
  .use(registryMiddleware)
  .route({
    method: 'GET',
    path: '/list',
    summary: '列出资源',
  })
  .func(async (input, ctx) => {
    return ctx.registry.resources
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
  })
