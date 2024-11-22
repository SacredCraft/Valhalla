import { createFetchHandler, router } from '@valhalla/api'

const handler = createFetchHandler({
  router,
  serverless: true,
})

async function handleRequest(request: Request) {
  return handler({
    request,
    prefix: '/api',
  })
}

export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const DELETE = handleRequest
export const PATCH = handleRequest
