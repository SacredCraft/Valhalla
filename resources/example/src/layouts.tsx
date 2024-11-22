import { createLayout } from '@valhalla/core/layout'

const Icon = () => <div>美术资源</div>

const initLayouts = () => {
  createLayout({
    name: 'example',
    match: () => true,
    menus: [
      {
        label: '美术资源',
        value: 'example',
        icon: Icon,
        render: () => <div>美术资源</div>,
      },
    ],
  })
}

export { initLayouts }
