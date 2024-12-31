import { getOwnedResources } from '@valhalla/api/router/resources'
import { auth } from '@valhalla/auth'

export const POST = async (req: Request) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  if (!session || session.user?.id === undefined) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = (await req.json()) as { documentName: string }

  if (!session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (session.user.role?.toLowerCase() === 'admin') {
    return new Response('OK', { status: 200 })
  }

  const { documentName } = body

  if (!documentName) {
    return new Response('Bad Request', { status: 400 })
  }

  const [resource] = documentName.split(' ')

  if (!resource) {
    return new Response('Bad Request', { status: 400 })
  }

  const ownedResources = await getOwnedResources({})

  const hasAccess = ownedResources.some((r) => r.name === resource)

  if (!hasAccess) {
    return new Response('Unauthorized', { status: 401 })
  }

  return new Response('OK', { status: 200 })
}
