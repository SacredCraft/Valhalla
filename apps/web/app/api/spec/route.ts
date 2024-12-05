import { generateOpenAPI } from '@orpc/openapi'

import { router } from '@valhalla/api'

export function GET() {
  const spec = generateOpenAPI({
    router,
    info: {
      title: 'Valhalla OpenAPI',
      version: '1.0.0',
      description: `
The example OpenAPI Playground for Valhalla.

## Resources

* [Github](https://github.com/unnoq/orpc)
* [Documentation](https://orpc.unnoq.com)
          `,
    },
    servers: [{ url: '/api' /** Should use absolute URLs in production */ }],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  })

  return new Response(JSON.stringify(spec), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
