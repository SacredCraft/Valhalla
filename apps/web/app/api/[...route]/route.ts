import { handle } from 'hono/vercel'

import { app } from '@valhalla/api/hono'

export const dynamic = 'force-dynamic'

const handler = handle(app)

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
