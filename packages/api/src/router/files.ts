import path from 'path'
import fs from 'fs-extra'
import { z } from 'zod'

import { registryMiddleware } from '../middlewares/registry'
import { authed } from '../orpc'

export const filesRouter = authed
  .tags('Files')
  .prefix('/files')
  .router({
    list: authed
      .use(registryMiddleware)
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

        // 获取目录下的文件基础信息 不读取文件内容
        const files = fs
          .readdirSync(resolvedPath)
          .filter((file) => !file.startsWith('.DS_Store'))
          .map((file) => {
            const filePath = path.join(resolvedPath, file)
            const stat = fs.statSync(filePath)
            return {
              name: file,
              isDirectory: stat.isDirectory(),
              size: stat.size,
              modifiedTime: stat.mtime.toISOString(),
            }
          })

        return files
      }),
  })
