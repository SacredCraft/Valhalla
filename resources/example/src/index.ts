import { createResource } from '@valhalla/core/resource'

const [example, layouts] = createResource({
  name: 'Example',
})

layouts.push({
  name: 'Example',
})

export { example, layouts }
