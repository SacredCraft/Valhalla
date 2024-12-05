import { createOpenAPIServerlessHandler } from '@orpc/openapi/fetch'

import { createORPCHandler, handleFetchRequest, router } from '@valhalla/api'

async function handler(request: Request) {
  return handleFetchRequest({
    router,
    request,
    prefix: '/api',
    handlers: [createORPCHandler(), createOpenAPIServerlessHandler()],
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
