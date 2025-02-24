import { Layout } from '@valhalla/core/schema/layout'

export const ImagePreviewLayout = {
  name: 'Image',
  priority: 1,
  match: (
    ctx,
    config: {
      imageExtensions: string[]
    }
  ) => {
    return config.imageExtensions.some((ext) => ctx.fileName.endsWith(ext))
  },
  component: 'ImagePreview',
} satisfies Layout

export const TextEditorLayout = {
  name: 'TextEditor',
  priority: 1,
  match: (
    ctx,
    config: {
      textExtensions: string[]
    }
  ) => {
    return config.textExtensions.some((ext) => ctx.fileName.endsWith(ext))
  },
  icon: (ctx) => {
    const ext = ctx.fileName.split('.').pop()
    switch (ext) {
      case 'json':
        return 'JSON'
      case 'yaml':
      case 'yml':
        return 'YAML'
      case 'kt':
        return 'Kotlin'
      default:
        return 'File'
    }
  },
  component: 'TextEditor',
} satisfies Layout

export const ItemEditorLayout = {
  name: 'ItemEditor',
  priority: 2,
  match: (ctx) => {
    return (
      ctx.filePath.includes('item') &&
      ctx.filePath.includes('FrontierItem') &&
      ctx.fileName.endsWith('.yml')
    )
  },
  component: 'ItemEditor',
} satisfies Layout
