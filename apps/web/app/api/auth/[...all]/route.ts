import { auth, toNextJsHandler } from '@valhalla/auth'

export const { GET, POST } = toNextJsHandler(auth.handler)
