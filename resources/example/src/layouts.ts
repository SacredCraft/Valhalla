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
