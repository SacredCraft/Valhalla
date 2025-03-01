import { z } from 'zod'

import { createResource } from '@valhalla/core/resource'

import './components'

import { copy } from 'fs-extra'

import { registerLifeCycle } from '@valhalla/core/life-cycle'
import { resolvePath } from '@valhalla/utils/path'

import {
  ImagePreviewLayout,
  ItemEditorLayout,
  TextEditorLayout,
} from './layouts'

const imageExtensions = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.bmp',
  '.tiff',
  '.ico',
]

const textExtensions = [
  '.conf',
  '.properties',
  '.view',
  '.txt',
  '.md',
  '.json',
  '.yaml',
  '.yml',
  '.toml',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.css',
  '.java',
  '.kt',
  '.kts',
  '.py',
  '.php',
  '.go',
  '.c',
  '.cpp',
  '.h',
  '.rs',
]

const example = createResource({
  name: 'example',
  description: '存储了一些美术资源',
  label: '美术资源',
  contentSchema: z.object({
    name: z.string().default('Bkm016'),
    imageExtensions: z.array(z.string()).default(imageExtensions),
    textExtensions: z.array(z.string()).default(textExtensions),
  }),
  layouts: [ImagePreviewLayout, TextEditorLayout, ItemEditorLayout],
})

registerLifeCycle('beforeInit', () => {
  copy(
    resolvePath('resources', 'example', 'assets'),
    resolvePath('apps', 'web', 'public', 'assets', 'example')
  )
})

export { example }
