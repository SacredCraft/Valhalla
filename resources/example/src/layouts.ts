import { createLayout } from '@valhalla/core/layout'

const initLayouts = () => {
  createLayout({
    name: 'example',
    match: () => true,
    menus: [
      {
        label: '美术资源',
        value: 'example',
        icon: 'Box',
        render: 'Example',
      },
    ],
  })
}

export { initLayouts }
