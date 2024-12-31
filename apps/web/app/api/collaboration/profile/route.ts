import { auth } from '@valhalla/auth'

const handler = async (req: Request) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  if (!session || session.user?.id === undefined) {
    return new Response('Unauthorized', { status: 401 })
  }

  return Response.json(session.user)
}

export { handler as GET, handler as POST }
