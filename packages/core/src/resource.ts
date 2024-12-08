import { z } from 'zod'

import { loadConfig } from './config'
import { Component } from './schema/component'
import { Config, configSchema } from './schema/configs'
import { Icon } from './schema/icon'
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
  components: Record<string, Component> = {}
  icons: Record<string, Icon> = {}
  layouts: Layout[] = []

  resources: Record<string, Resource> = {}
  resourceLayouts: Record<string, Layout[]> = {}
  resourcesConfigs: Record<string, unknown> = {}
  resourcesFolders: Record<string, Folder[]> = {}

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
  label,
  contentSchema = z.object({}),
  layouts,
}: Resource & {
  contentSchema?: z.ZodObject<z.ZodRawShape>
  layouts?: Layout[]
}): ((options?: ResourceOptions) => Resource) => {
  const resource: Resource = resourceSchema.parse({
    name,
    description,
    label,
    config: {
      name,
      version: '0.0.1',
      path: `resources/${name}/configs.yaml`,
      content: contentSchema,
    },
  } satisfies Resource)

  return (options: ResourceOptions = {}) => {
    const newResource: Resource = {
      ...resource,
      ...options,
    }

    // 检查同名资源是否已存在
    if (registry.resources[newResource.name]) {
      throw new Error(`资源 ${newResource.name} 已存在`)
    }

    const config = configSchema.parse({
      name: newResource.name,
      version: newResource.config?.version,
      path: `resources/${newResource.name}/configs.yaml`,
      content: newResource.config?.content,
    })

    // 加载配置
    if (newResource.config) {
      registry.resourcesConfigs[newResource.name] = loadConfig(config, true)

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

    if (layouts) {
      registry.resourceLayouts[newResource.name] = layouts
    }

    return newResource
  }
}

const getRegistry = () => ResourceRegistry.getInstance()

export const createGlobalLayout = (layout: Layout) => {
  const registry = getRegistry()
  registry.layouts.push(layout)
  return layout
}

export const createComponent = (component: Component) => {
  const registry = getRegistry()
  registry.components[component.name] = component
  return component
}

export const createIcon = (icon: Icon) => {
  const registry = getRegistry()
  registry.icons[icon.name] = icon
  return icon
}

export { createResource, getRegistry }
