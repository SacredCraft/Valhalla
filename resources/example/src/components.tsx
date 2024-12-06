import { createComponent } from '@valhalla/core/components'

export const initComponents = () => {
  createComponent({
    name: 'Example',
    component: '@valhalla/example/components/test',
  })
}
