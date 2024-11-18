import { z } from 'zod'

import { createResource } from '@valhalla/core/resource'

const [example, layouts] = createResource({
  name: 'example',
  contentSchema: z.object({
    name: z.string().default('Bkm016'),
  }),
})

layouts.push({
  name: 'example',
})

export { example, layouts }
