import { generateComponents, generateIcons } from '@valhalla/core/components'
import {
  initDefaultIconsAndComponents,
  initGlobalLayouts,
} from '@valhalla/core/init'
import { example } from '@valhalla/example'

example({
  name: 'example',
})

example({
  name: 'attributes',
  label: '属性配置',
  description: '这里是开拓者服务器的属性配置',
})

const init = () => {
  initDefaultIconsAndComponents()
  initGlobalLayouts()
  generateComponents()
  generateIcons()
}

export { init }
