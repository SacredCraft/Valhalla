import { createResource } from '@valhalla/core/resource'

const [example, layouts] = createResource({
  name: 'example',
})

layouts.push({
  name: 'example',
})

export { example, layouts }
