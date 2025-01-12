import path from 'path'
import fs from 'fs-extra'
import { z } from 'zod'

import { checkFileExistMiddleware } from '@valhalla/api/middlewares/file'
import {
  layoutsMiddleware,
  matchLayoutMiddleware,
} from '@valhalla/api/middlewares/registry'
import {
  availableResourcePathMiddleware,
  fileEditMiddleware,
  resourcePermissionMiddleware,
} from '@valhalla/api/middlewares/security'
import { authed } from '@valhalla/api/orpc'
import { matchLayoutInput } from '@valhalla/api/schemas'

import { moveFileInput, renameFileInput } from './files.schemas'

export const filesRouter = authed
  .tags('Files')
  .prefix('/files')
  .router({
    layout: authed
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
        return {
          matchLayout: ctx.matchLayout,
          icon: ctx.icon,
        }
      }),

    exist: authed
      .route({
        method: 'GET',
        path: '/is-file-exist',
        summary: '判断文件是否存在',
      })
      .input(matchLayoutInput)
      .use(checkFileExistMiddleware(false))
      .func((_input, ctx) => {
        return ctx.fileExist
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
      .use(resourcePermissionMiddleware)
      .use(availableResourcePathMiddleware)
      .func(async (input, ctx) => {
        const folders = ctx.folders

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

        const resourceConfig = ctx.registry.resourcesConfigs[input.resourceName]

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
              layout.match(
                {
                  resourceName: input.resourceName,
                  resourceFolder: input.resourceFolder,
                  filePath: path.join(input.path, file),
                  fileName: file,
                },
                resourceConfig
              )
            )

            const icon = layout?.icon
              ? layout.icon(
                  {
                    resourceName: input.resourceName,
                    resourceFolder: input.resourceFolder,
                    filePath: path.join(input.path, file),
                    fileName: file,
                  },
                  resourceConfig
                )
              : 'File'

            const filePath = path.join(resolvedPath, file)
            const stat = fs.statSync(filePath)

            return {
              name: file,
              isDirectory: stat.isDirectory(),
              size: stat.size,
              modifiedTime: stat.mtime.toISOString(),
              icon,
            }
          })

        return files
      }),

    read: authed
      .route({
        method: 'GET',
        path: '/read',
        summary: '读取文件',
      })
      .input(
        matchLayoutInput.extend({
          readFileOptions: z.any().optional(),
        })
      )
      .output(z.unknown())
      .use(checkFileExistMiddleware(true))
      .func(async (input, ctx) => {
        return fs.readFileSync(ctx.filePath!, input.readFileOptions)
      }),

    save: authed
      .route({
        method: 'POST',
        path: '/save',
        summary: '保存文件',
      })
      .input(
        matchLayoutInput.extend({
          data: z.any(),
          writeFileOptions: z.any().optional(),
        })
      )
      .use(checkFileExistMiddleware(true))
      .func(async (input, ctx) => {
        return fs.writeFileSync(
          ctx.filePath!,
          input.data,
          input.writeFileOptions
        )
      }),

    move: authed
      .route({
        method: 'POST',
        path: '/move',
        summary: '移动文件',
      })
      .input(moveFileInput)
      .use(checkFileExistMiddleware(true))
      .use(fileEditMiddleware)
      .func(async (input, ctx) => {
        const newPath = path.join(input.newPath, path.basename(ctx.filePath!))
        ctx.securityCheck(newPath, input.resourceFolder)
        return fs.renameSync(ctx.filePath!, newPath)
      }),

    rename: authed
      .route({
        method: 'POST',
        path: '/rename',
        summary: '重命名文件',
      })
      .input(renameFileInput)
      .use(checkFileExistMiddleware(true))
      .use(fileEditMiddleware)
      .func(async (input, ctx) => {
        const newPath = path.join(path.dirname(ctx.filePath!), input.newName)
        ctx.securityCheck(newPath, input.resourceFolder)
        return fs.renameSync(ctx.filePath!, newPath)
      }),

    delete: authed
      .route({
        method: 'POST',
        path: '/delete',
        summary: '删除文件',
      })
      .input(matchLayoutInput)
      .use(checkFileExistMiddleware(true))
      .use(fileEditMiddleware)
      .func(async (input, ctx) => {
        ctx.securityCheck(ctx.filePath!, input.resourceFolder)
        return fs.unlinkSync(ctx.filePath!)
      }),
  })
