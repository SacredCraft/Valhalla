import { ORPCError } from '@orpc/server'
import * as fs from 'fs-extra'

import { authed } from '@valhalla/api/orpc'

import { registryMiddleware } from './registry'

export const permissionMiddleware = (role: string) =>
  authed.middleware((_input, context, meta) => {
    if (context.user.role !== role) {
      throw new ORPCError({
        code: 'FORBIDDEN',
        message: 'Permission denied',
      })
    }

    return meta.next({})
  })

export const resourcePermissionMiddleware = registryMiddleware.concat(
  async (input: { resourceName: string }, ctx, meta) => {
    if (ctx.user.role === 'admin') {
      return meta.next({})
    }

    const ownedResources = ctx.ownedResources

    if (
      !ownedResources.some((resource) => resource.name === input.resourceName)
    ) {
      throw new ORPCError({
        code: 'FORBIDDEN',
        message: 'Permission denied',
      })
    }

    return meta.next({})
  }
)

export const availableResourcePathMiddleware = registryMiddleware.concat(
  (input: { resourceName: string }, ctx, meta) => {
    const resource = ctx.ownedResources.find(
      (resource) => resource.name === input.resourceName
    )

    if (!resource) {
      throw new ORPCError({
        code: 'NOT_FOUND',
        message: 'Resource not found',
      })
    }

    const folders = ctx.registry.resourcesFolders[input.resourceName]

    return meta.next({
      context: {
        resource,
        folders,
      },
    })
  }
)

export const fileEditMiddleware = availableResourcePathMiddleware.concat(
  (input: { resourceName: string }, ctx, meta) => {
    const folders = ctx.folders

    const securityCheck = (filePath: string, folder?: string) => {
      let isInFolders = false

      if (folder) {
        isInFolders = filePath.startsWith(folder)
      } else {
        isInFolders = folders.some((folder) => filePath.startsWith(folder.path))
      }

      if (!isInFolders) {
        throw new ORPCError({
          code: 'FORBIDDEN',
          message: 'Permission denied',
        })
      }

      return true
    }

    return meta.next({
      context: {
        fs,
        securityCheck,
      },
    })
  }
)
