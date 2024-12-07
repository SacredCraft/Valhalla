import path from 'path'
import fs from 'fs-extra'
import { z } from 'zod'

import {
  layoutsMiddleware,
  matchLayoutMiddleware,
} from '../middlewares/registry'
import { authed } from '../orpc'

export const filesRouter = authed
  .tags('Files')
  .prefix('/files')
  .router({
    query: authed
      .route({
        method: 'GET',
        path: '/query',
        summary: '查询文件',
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
      .func(async (_input, ctx) => {
        return ctx.matchLayout
      }),

    list: authed
      .use(layoutsMiddleware)
      .route({
        method: 'GET',
        path: '/list',
        summary: '列出文件',
      })
      .input(
        z.object({
          resourceName: z.string(),
          resourceFolder: z.string(),
          path: z.string(),
        })
      )
      .func(async (input, ctx) => {
        // 记得检查权限

        const folders = ctx.registry.resourcesFolders[input.resourceName]
        const folderPath = folders.find(
          (f) => f.name === input.resourceFolder
        )?.path

        // Folder 不存在
        if (!folderPath) {
          return []
        }

        const resolvedPath = path.join(folderPath, input.path)

        // 验证 resolvedPath 是否存在
        if (!fs.existsSync(resolvedPath)) {
          return []
        }

        const resourceLayouts = ctx.resourceLayouts[input.resourceName]
        const layouts = [...ctx.layouts, ...resourceLayouts].sort(
          (a, b) => b.priority - a.priority
        )

        // 获取目录下的文件基础信息 不读取文件内容
        const files = fs
          .readdirSync(resolvedPath)
          .filter((file) => !file.startsWith('.DS_Store'))
          .map((file) => {
            const layout = layouts.find((layout) =>
              layout.match({
                resourceName: input.resourceName,
                resourceFolder: input.resourceFolder,
                filePath: path.join(input.path, file),
                fileName: file,
              })
            )
            const filePath = path.join(resolvedPath, file)
            const stat = fs.statSync(filePath)

            return {
              name: file,
              isDirectory: stat.isDirectory(),
              size: stat.size,
              modifiedTime: stat.mtime.toISOString(),
              icon: layout?.icon ?? 'File',
            }
          })

        return files
      }),
  })
