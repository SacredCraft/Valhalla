import { Layout } from './schema/layout'

declare global {
  // eslint-disable-next-line no-var
  var _layoutRegistry: LayoutRegistry | undefined
}

class LayoutRegistry {
  layouts: Record<string, Layout[]> = {}

  static getInstance(): LayoutRegistry {
    if (!global._layoutRegistry) {
      global._layoutRegistry = new LayoutRegistry()
    }
    return global._layoutRegistry
  }
}

const getLayoutRegistry = () => {
  return LayoutRegistry.getInstance()
}

const createLayout = (layout: Layout) => {
  const registry = getLayoutRegistry()
  const layouts = registry.layouts[layout.name] || []
  layouts.push(layout)
  registry.layouts[layout.name] = layouts
  return layout
}

export { LayoutRegistry, getLayoutRegistry, createLayout }
