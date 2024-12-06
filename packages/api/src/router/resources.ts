import { z } from 'zod'

import { getLayoutRegistry } from '@valhalla/core/layout'

import { registryMiddleware } from '../middlewares/registry'
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

export const getLayout = authed
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
  .func((input, ctx) => {
    const layouts = getLayoutRegistry()
    return layouts.layouts['example']
  })

export const resourcesRouter = authed
  .tags('Resources')
  .prefix('/resources')
  .router({
    list: getResources,

    layout: getLayout,

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

    foo: authed
      .use(registryMiddleware)
      .input(z.object({}))
      .func(() => {
        return {
          a: '',
        }
      }),
  })
