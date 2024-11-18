import { z } from 'zod'

import { loadConfig } from './config'
import { Config, configSchema } from './schema/configs'
import { Layout } from './schema/layout'
import {
  Folder,
  folderSchema,
  Resource,
  resourceSchema,
} from './schema/resource'

declare global {
  // eslint-disable-next-line no-var
  var _resourceRegistry: ResourceRegistry | undefined
}

class ResourceRegistry {
  resources: Record<string, Resource> = {}
  resourcesConfigs: Record<string, unknown> = {}
  resourcesFolders: Record<string, Folder[]> = {}
  resourcesLayouts: Record<string, Layout[]> = {}

  static getInstance(): ResourceRegistry {
    if (!global._resourceRegistry) {
      global._resourceRegistry = new ResourceRegistry()
    }
    return global._resourceRegistry
  }

  getConfig<T extends Config>(config: T) {
    return this.resourcesConfigs[config.name] as z.infer<T['content']>
  }
}

const registry = ResourceRegistry.getInstance()

type ResourceOptions = Partial<Resource>

const createResource = ({
  name,
  description,
  contentSchema = z.object({}),
}: Resource & {
  contentSchema?: z.ZodObject<z.ZodRawShape>
}): [(options?: ResourceOptions) => Resource, Layout[]] => {
  const resource: Resource = resourceSchema.parse({
    name,
    description,
    config: {
      name,
      version: '0.0.1',
      path: `resources/${name}/configs.yaml`,
      content: contentSchema,
    },
  } satisfies Resource)

  if (!registry.resourcesLayouts[resource.name]) {
    registry.resourcesLayouts[resource.name] = []
  }

  return [
    (options: ResourceOptions = {}) => {
      const newResource: Resource = {
        ...resource,
        ...options,
      }

      if (newResource.config) {
        newResource.config.name = options?.config?.version ?? name
        newResource.config.path = `resources/${newResource.name}/configs.yaml`
      }

      // 检查同名资源是否已存在
      if (registry.resources[newResource.name]) {
        throw new Error(`资源 ${newResource.name} 已存在`)
      }

      // registry.resourcesFolders[newResource.name] = folders

      // 加载配置
      if (newResource.config) {
        registry.resourcesConfigs[newResource.name] = loadConfig(
          newResource.config,
          true
        )

        const folderConfig = configSchema.parse({
          name: `${newResource.name}-folders`,
          version: newResource.config.version,
          path: `resources/${newResource.name}/folders.yaml`,
          content: z.array(folderSchema).default([]),
        })

        const folders = loadConfig(folderConfig, true, [])

        registry.resourcesFolders[newResource.name] = folders as Folder[]
      }

      registry.resources[newResource.name] = newResource
      if (!registry.resourcesLayouts[newResource.name]) {
        registry.resourcesLayouts[newResource.name] =
          registry.resourcesLayouts[resource.name]
      }

      return newResource
    },
    registry.resourcesLayouts[resource.name],
  ]
}

const getRegistry = () => ResourceRegistry.getInstance()

export { createResource, getRegistry }
