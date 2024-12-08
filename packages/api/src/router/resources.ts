import path from 'path'
import fs from 'fs-extra'
import { z } from 'zod'

import { matchLayoutInput } from '@/schemas'

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
      .input(matchLayoutInput)
      .use(matchLayoutMiddleware)
      .func((input, ctx) => {
        return ctx.matchLayout
      }),

    isFileExist: authed
      .use(registryMiddleware)
      .route({
        method: 'GET',
        path: '/is-file-exist',
        summary: '判断文件是否存在',
      })
      .input(matchLayoutInput)
      .func((input, ctx) => {
        const folders = ctx.registry.resourcesFolders[input.resourceName]
        if (!folders) {
          return false
        }
        const folder = folders.find(
          (folder) => folder.name === input.resourceFolder
        )
        if (!folder) {
          return false
        }
        return fs.existsSync(path.join(folder.path, input.filePath))
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
