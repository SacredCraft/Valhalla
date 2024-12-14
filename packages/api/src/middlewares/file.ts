import path from 'path'
import { ORPCError } from '@orpc/server'
import fs from 'fs-extra'

import { MatchLayoutInput } from '@valhalla/api/schemas'

import { registryMiddleware } from './registry'

export const checkFileExistMiddleware = (throwError: boolean = true) =>
  registryMiddleware.concat((input: MatchLayoutInput, ctx, meta) => {
    const folders = ctx.registry.resourcesFolders[input.resourceName]
    if (!folders) {
      if (throwError) {
        throw new ORPCError({
          code: 'NOT_FOUND',
          message: 'Resource not found',
        })
      }
      return meta.next({
        context: {
          ...ctx,
          fileExist: false,
          filePath: null as string | null,
        },
      })
    }
    const folder = folders.find(
      (folder) => folder.name === input.resourceFolder
    )
    if (!folder) {
      if (throwError) {
        throw new ORPCError({
          code: 'NOT_FOUND',
          message: 'Resource folder not found',
        })
      }
      return meta.next({
        context: {
          ...ctx,
          fileExist: false,
          filePath: null as string | null,
        },
      })
    }
    const filePath = path.join(folder.path, input.filePath)
    if (!fs.existsSync(filePath)) {
      if (throwError) {
        throw new ORPCError({
          code: 'NOT_FOUND',
          message: 'File not found',
        })
      }
      return meta.next({
        context: {
          ...ctx,
          fileExist: false,
          filePath: null as string | null,
        },
      })
    }
    return meta.next({
      context: {
        ...ctx,
        fileExist: true,
        filePath,
      },
    })
  })
