import { z } from 'zod'

import { loadConfig } from './config'
import { Layout } from './schema/layout'
import { Resource, resourceSchema } from './schema/resource'

declare global {
  // eslint-disable-next-line no-var
  var _resourceRegistry: ResourceRegistry | undefined
}

class ResourceRegistry {
  resources: Record<string, Resource> = {}
  resourcesConfigs: Record<string, unknown> = {}
  resourcesPaths: Record<string, string[]> = {}
  resourcesLayouts: Record<string, Layout[]> = {}

  static getInstance(): ResourceRegistry {
    if (!global._resourceRegistry) {
      global._resourceRegistry = new ResourceRegistry()
    }
    return global._resourceRegistry
  }
}

const registry = ResourceRegistry.getInstance()

const createResource = ({
  name,
  description,
  contentSchema,
}: Resource & {
  contentSchema?: z.ZodObject<z.ZodRawShape>
}): [(options?: Partial<Resource>) => Resource, Layout[]] => {
  const schema = resourceSchema()

  const resource: Resource = schema.parse({
    name,
    description,
    config: {
      name,
      version: '0.0.1',
      path: `resources/${name}/configs.yaml`,
      content: contentSchema,
    },
  })

  if (!registry.resourcesLayouts[resource.name]) {
    registry.resourcesLayouts[resource.name] = []
  }

  return [
    (options?: Partial<Resource>) => {
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

      // 加载配置
      if (newResource.config) {
        registry.resourcesConfigs[newResource.name] = loadConfig(
          newResource.config,
          true
        )
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
