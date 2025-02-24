import { registerLifeCycle } from '@valhalla/core/life-cycle'
import { createComponent } from '@valhalla/core/resource'

registerLifeCycle('beforeInit', () => {
  createComponent({
    name: 'ImagePreview',
    component: '@valhalla/example/components/image-preview',
  })
  createComponent({
    name: 'TextEditor',
    component: '@valhalla/example/components/text-editor',
  })
  createComponent({
    name: 'ItemEditor',
    component: '@valhalla/example/components/item-editor/index',
  })
})
