import { writeFile } from 'fs/promises'
import { join } from 'path'
import { globby } from 'globby'

import { resolvePath } from '@valhalla/utils/path'

export async function generateRouteMap() {
  const routesDir = resolvePath('packages', 'api', 'src', 'router', 'hono')

  const routes = await globby(['**/route.ts'], {
    cwd: routesDir,
    gitignore: true,
    absolute: false,
    ignore: ['routes.generated.ts'],
  })

  const content = `
// 此文件由 generate-routes.ts 自动生成
import type { Handler } from 'hono'

import type { RouteConfig } from './index'

export interface RouteModule {
  GET?: Handler
  POST?: Handler
  PUT?: Handler
  DELETE?: Handler
  config?: RouteConfig
}

export const ROUTE_MAP: Record<string, () => Promise<RouteModule>> = {
${routes
  .map((route) => {
    const importPath = './' + route.replace(/\.ts$/, '')
    return `  '${route}': () => import('${importPath}') as Promise<RouteModule>,`
  })
  .join('\n')}
}

export type RouteMap = typeof ROUTE_MAP
`

  await writeFile(join(routesDir, 'routes.generated.ts'), content)
}

generateRouteMap().catch(console.error)
