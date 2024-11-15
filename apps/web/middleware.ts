import { NextResponse, type NextRequest } from 'next/server'
import ky from 'ky'

import type { Session } from '@valhalla/auth'

export default async function authMiddleware(request: NextRequest) {
  const baseUrl = process.env.BETTER_AUTH_URL || request.nextUrl.origin

  const data = await ky<Session | null>(`${baseUrl}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
  })
    .json()
    .catch(() => null)

  const session = data?.session

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!sign-in$|_next|api|$).*)'],
}
