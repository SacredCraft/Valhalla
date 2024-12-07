import { z } from 'zod'

import {
  matchLayoutMiddleware,
  registryMiddleware,
} from '../middlewares/registry'
import { authed } from '../orpc'

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
    list: getResources,

    layout: authed
      .route({
        method: 'GET',
        path: '/layout',
        summary: '获取资源布局',
      })
      .input(
        z.object({
          resourceName: z.string(),
          resourceFolder: z.string(),
          filePath: z.string(),
          fileName: z.string(),
        })
      )
      .use(matchLayoutMiddleware)
      .func((input, ctx) => {
        return ctx.matchLayout ?? null
      }),

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
