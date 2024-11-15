import { loadConfig } from './config'
import { Layout } from './schema/layout'
import { Resource } from './schema/resource'

const resources: Record<string, Resource> = {}
const resourcesConfigs: Record<string, unknown> = {}
const resourcesPaths: Record<string, string[]> = {}
const resourcesLayouts: Record<string, Layout[]> = {}

const createResource = (
  resource: Resource
): [(options?: Partial<Resource>) => Resource, Layout[]] => {
  if (!resourcesLayouts[resource.name]) {
    resourcesLayouts[resource.name] = []
  }

  return [
    (options?: Partial<Resource>) => {
      const newResource = {
        ...resource,
        ...options,
      }
      if (newResource.config) {
        resourcesConfigs[newResource.name] = loadConfig(
          newResource.config,
          false,
          `resources/${newResource.name}`
        )
      }
      resources[newResource.name] = newResource
      if (!resourcesLayouts[newResource.name]) {
        resourcesLayouts[newResource.name] = []
      }
      return newResource
    },
    resourcesLayouts[resource.name],
  ]
}

const createResources = (
  resource: Resource,
  names: string[]
): [Resource[], Layout[][]] => {
  const resources: Resource[] = []
  const layouts: Layout[][] = []
  const [creator, resourceLayouts] = createResource(resource)
  for (const name of names) {
    const newResource = creator({ name })
    resources.push(newResource)
    layouts.push(resourceLayouts)
  }
  return [resources, layouts]
}

export { resources, resourcesConfigs, resourcesPaths, resourcesLayouts }
export { createResource, createResources }
