import { createComponent } from '@valhalla/core/resource'

export const initComponents = () => {
  createComponent({
    name: 'Example',
    component: '@valhalla/example/components/test',
  })
}

export const initIcons = () => {}
