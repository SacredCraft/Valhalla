import { createLayout } from '@valhalla/core/layout'

const initLayouts = () => {
  createLayout({
    name: 'example',
    match: () => true,
    component: 'Example',
  })
}

export { initLayouts }
