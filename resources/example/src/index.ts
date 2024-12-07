import { z } from 'zod'

import { createResource } from '@valhalla/core/resource'

import { initComponents, initIcons } from './components'

const example = createResource({
  name: 'example',
  description: '存储了一些美术资源',
  label: '美术资源',
  contentSchema: z.object({
    name: z.string().default('Bkm016'),
  }),
  layouts: [],
})

initComponents()
initIcons()

export { example }
