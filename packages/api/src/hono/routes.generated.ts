
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
  'notification/route.ts': () => import('./notification/route') as Promise<RouteModule>,
  'auth/[...all]/route.ts': () => import('./auth/[...all]/route') as Promise<RouteModule>,
  'avatars/[userId]/route.ts': () => import('./avatars/[userId]/route') as Promise<RouteModule>,
  'upload/avatar/route.ts': () => import('./upload/avatar/route') as Promise<RouteModule>,
  'trpc/[trpc]/route.ts': () => import('./trpc/[trpc]/route') as Promise<RouteModule>,
}

export type RouteMap = typeof ROUTE_MAP
