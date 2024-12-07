import { createGlobalLayout, createIcon } from './resource'

export const initDefaultIconsAndComponents = () => {
  createDefaultIcons()
  createDefaultComponents()
}

const createDefaultIcons = () => {
  createIcon({
    name: 'YAML',
    component: '@/components/icons',
    names: ['YAML'],
    defaultExport: false,
    exportName: 'Icons',
  })
  createIcon({
    name: 'JSON',
    component: 'lucide-react',
    defaultExport: false,
    exportName: 'Braces',
  })
  createIcon({
    name: 'File',
    component: 'lucide-react',
    defaultExport: false,
    exportName: 'File',
  })
  createIcon({
    name: 'Kotlin',
    component: '@/components/icons',
    names: ['Kotlin'],
    defaultExport: false,
    exportName: 'Icons',
  })
}

const createDefaultComponents = () => {}

export const initGlobalLayouts = () => {
  createGlobalLayout({
    name: 'GlobalYAML',
    match: (ctx) => ctx.fileName.endsWith('.yaml'),
    priority: 0,
    icon: 'YAML',
  })
  createGlobalLayout({
    name: 'GlobalJSON',
    match: (ctx) => ctx.fileName.endsWith('.json'),
    priority: 0,
    icon: 'JSON',
  })
  createGlobalLayout({
    name: 'GlobalKotlin',
    match: (ctx) => ctx.fileName.endsWith('.kt'),
    priority: 0,
    icon: 'Kotlin',
  })
}
