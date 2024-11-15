import { Context, Hono, MiddlewareHandler } from 'hono'

import { ROUTE_MAP } from './routes.generated'

export interface RouteConfig {
  middlewares?: (
    | MiddlewareHandler
    | {
        handler: MiddlewareHandler
        enabledFor?: Record<keyof RouteModule & undefined, boolean>
      }
  )[]
}

export type Handler = (c: Context) => Promise<Response> | Response

export interface RouteModule {
  GET?: Handler
  POST?: Handler
  PUT?: Handler
  DELETE?: Handler
  config?: RouteConfig
}

const app = new Hono().basePath('/api')

interface Options {
  middlewares?: MiddlewareHandler[]
}

const loadRoutes = async ({ middlewares }: Options = {}) => {
  if (middlewares) {
    app.use('*', ...middlewares)
  }

  for (const [file, importFn] of Object.entries(ROUTE_MAP)) {
    try {
      const module = (await importFn()) as RouteModule

      const routePath =
        '/' +
          file
            .replace(/(route)\.ts$/, '')
            .replace(/\[([^\]]+)\]/g, ':$1')
            .replace(/\[\.\.\.([^\]]+)\]/g, '*')
            .replace(/\([^)]+\)\//g, '')
            .replace(/@[^/]+\//g, '')
            .replace(/\/$/, '') || '/'

      const handledRoutes = new Set<keyof RouteModule>()

      if (module.config?.middlewares) {
        for (const middleware of module.config.middlewares) {
          if (typeof middleware === 'function') {
            app.use(routePath, middleware)
          } else {
            const { handler, enabledFor } = middleware
            if (!enabledFor) {
              app.use(routePath, handler)
            } else {
              Object.entries(enabledFor).forEach(([method]) => {
                const upperMethod = method.toUpperCase() as keyof RouteModule
                if (module[upperMethod]) {
                  app.on(
                    [upperMethod],
                    routePath,
                    handler,
                    module[upperMethod] as Handler
                  )
                  handledRoutes.add(upperMethod)
                }
              })
            }
          }
        }
      }

      if (module.GET && !handledRoutes.has('GET'))
        app.get(routePath, module.GET)
      if (module.POST && !handledRoutes.has('POST'))
        app.post(routePath, module.POST)
      if (module.PUT && !handledRoutes.has('PUT'))
        app.put(routePath, module.PUT)
      if (module.DELETE && !handledRoutes.has('DELETE'))
        app.delete(routePath, module.DELETE)
    } catch (err) {
      console.error(`加载路由失败: ${file}`, err)
    }
  }
}

await loadRoutes()

export { app }
