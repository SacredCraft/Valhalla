import fs from 'fs-extra'
import yaml from 'yaml'
import { z } from 'zod'

import { CONFIG_PATH } from '@valhalla/core/config'
import { resolvePath } from '@valhalla/utils/path'

import { registryMiddleware } from '@/middlewares/registry'
import { admin, authed } from '@/orpc'

export const pathsRouter = authed
  .tags('Paths')
  .prefix('/paths')
  .router({
    list: admin
      .use(registryMiddleware)
      .input(
        z.object({
          resourceName: z.string(),
        })
      )
      .func(async (input, ctx) => {
        return ctx.registry.resourcesFolders[input.resourceName]
      }),

    update: admin
      .use(registryMiddleware)
      .input(
        z.object({
          resourceName: z.string(),
          data: z.array(
            z.object({
              path: z.string(),
              name: z.string(),
            })
          ),
        })
      )
      .func(async (input, ctx) => {
        const filePath = resolvePath(
          CONFIG_PATH,
          'resources',
          input.resourceName,
          'folders.yaml'
        )

        await fs.ensureFile(filePath)

        await fs.writeFile(filePath, yaml.stringify(input.data))

        ctx.registry.resourcesFolders[input.resourceName] = input.data
      }),
  })
