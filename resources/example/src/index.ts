import { z } from 'zod'

import { createResource } from '@valhalla/core/resource'

import './components'

import { ImagePreviewLayout } from './layouts'

const imageExtensions = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.bmp',
  '.tiff',
  '.ico',
]

const example = createResource({
  name: 'example',
  description: '存储了一些美术资源',
  label: '美术资源',
  contentSchema: z.object({
    name: z.string().default('Bkm016'),
    imageExtensions: z.array(z.string()).default(imageExtensions),
  }),
  layouts: [ImagePreviewLayout],
})

export { example }
