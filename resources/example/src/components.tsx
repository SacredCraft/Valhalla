import { registerLifeCycle } from '@valhalla/core/life-cycle'
import { createComponent } from '@valhalla/core/resource'

registerLifeCycle('beforeInit', () => {
  createComponent({
    name: 'Example',
    component: '@valhalla/example/components/test',
  })
})
