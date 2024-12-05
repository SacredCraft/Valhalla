import { z } from 'zod'

import { resourceSchema } from '@valhalla/core/schema/resource'

import { registryMiddleware } from '../middlewares/registry'
import { authed } from '../orpc'

export const getResources = authed
  .use(registryMiddleware)
  .route({
    method: 'GET',
    path: '/list',
    summary: '列出资源',
  })
  .output(z.record(z.string(), resourceSchema))
  .func(async (input, ctx) => {
    return ctx.registry.resources
  })

export const resourcesRouter = authed
  .tags('Resources')
  .prefix('/resources')
  .router({
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
      .func(async (input, ctx) => {
        return ctx.registry.resourcesFolders[input.name].map((folder) => ({
          name: folder.name,
        }))
      }),
  })
