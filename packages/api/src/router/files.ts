import os from 'os'
import path from 'path'
import { ORPCError } from '@orpc/server'
import archiver from 'archiver'
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

import {
  moveFileInput,
  renameFileInput,
  uploadFileInput,
} from './files.schemas'

export const list = authed
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
  })

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

    list,

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
        try {
          if (fs.statSync(ctx.filePath!).isDirectory()) {
            return fs.removeSync(ctx.filePath!)
          }
          return fs.unlinkSync(ctx.filePath!)
        } catch {
          throw new ORPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete file',
          })
        }
      }),

    upload: authed
      .route({
        method: 'POST',
        path: '/upload',
        summary: '上传文件',
      })
      .input(uploadFileInput)
      .use(fileEditMiddleware)
      .func(async (input, ctx) => {
        const folders = ctx.registry.resourcesFolders[input.resourceName]
        if (!folders) {
          throw new ORPCError({
            code: 'NOT_FOUND',
            message: 'Resource not found',
          })
        }
        const folder = folders.find(
          (folder) => folder.name === input.resourceFolder
        )
        if (!folder) {
          throw new ORPCError({
            code: 'NOT_FOUND',
            message: 'Resource folder not found',
          })
        }
        const targetPath = path.join(
          folder.path,
          input.targetPath,
          input.file.name
        )
        ctx.securityCheck(targetPath, input.resourceFolder)
        const buffer = await input.file.arrayBuffer()
        fs.writeFileSync(targetPath, Buffer.from(buffer))
      }),

    download: authed
      .route({
        method: 'GET',
        path: '/download',
        summary: '下载文件',
      })
      .input(matchLayoutInput)
      .use(checkFileExistMiddleware(true))
      .func(async (_input, ctx) => {
        try {
          const stat = fs.statSync(ctx.filePath!)

          // 如果是文件，直接返回文件内容
          if (!stat.isDirectory()) {
            // 使用 Buffer.from 确保返回正确的 Buffer 对象
            const fileContent = fs.readFileSync(ctx.filePath!)
            return Buffer.from(fileContent)
          }

          // 如果是文件夹，创建 zip 文件
          const archive = archiver('zip', {
            zlib: { level: 9 },
          })

          // 创建临时文件来存储 zip
          const tempFile = path.join(
            os.tmpdir(), // 使用系统临时目录
            `temp_${Date.now()}_${path.basename(ctx.filePath!)}.zip`
          )

          const output = fs.createWriteStream(tempFile)

          // 等待 zip 文件创建完成
          await new Promise((resolve, reject) => {
            output.on('close', resolve)
            output.on('error', reject)
            archive.on('error', reject)

            archive.pipe(output)
            archive.directory(ctx.filePath!, false)
            archive.finalize()
          })

          // 读取并返回 zip 文件内容
          const zipContent = fs.readFileSync(tempFile)

          // 删除临时文件
          fs.unlinkSync(tempFile)

          // 确保返回正确的 Buffer 对象
          return Buffer.from(zipContent)
        } catch (error) {
          console.error('Download error:', error)
          throw new ORPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '文件下载失败',
            cause: error,
          })
        }
      }),

    createFolder: authed
      .route({
        method: 'POST',
        path: '/create-folder',
        summary: '创建文件夹',
      })
      .input(
        z.object({
          resourceName: z.string(),
          resourceFolder: z.string(),
          path: z.string(),
          folderName: z.string(),
        })
      )
      .use(fileEditMiddleware)
      .func(async (input, ctx) => {
        const folders = ctx.registry.resourcesFolders[input.resourceName]
        if (!folders) {
          throw new ORPCError({
            code: 'NOT_FOUND',
            message: 'Resource not found',
          })
        }
        const folder = folders.find(
          (folder) => folder.name === input.resourceFolder
        )
        if (!folder) {
          throw new ORPCError({
            code: 'NOT_FOUND',
            message: 'Resource folder not found',
          })
        }
        const targetPath = path.join(folder.path, input.path, input.folderName)
        ctx.securityCheck(targetPath, input.resourceFolder)
        fs.mkdirSync(targetPath)
      }),

    createFile: authed
      .route({
        method: 'POST',
        path: '/create-file',
        summary: '创建文件',
      })
      .input(
        z.object({
          resourceName: z.string(),
          resourceFolder: z.string(),
          path: z.string(),
          fileName: z.string(),
        })
      )
      .use(fileEditMiddleware)
      .func(async (input, ctx) => {
        const folders = ctx.registry.resourcesFolders[input.resourceName]
        if (!folders) {
          throw new ORPCError({
            code: 'NOT_FOUND',
            message: 'Resource not found',
          })
        }
        const folder = folders.find(
          (folder) => folder.name === input.resourceFolder
        )
        if (!folder) {
          throw new ORPCError({
            code: 'NOT_FOUND',
            message: 'Resource folder not found',
          })
        }
        const targetPath = path.join(folder.path, input.path, input.fileName)
        ctx.securityCheck(targetPath, input.resourceFolder)
        fs.writeFileSync(targetPath, '')
      }),
  })
