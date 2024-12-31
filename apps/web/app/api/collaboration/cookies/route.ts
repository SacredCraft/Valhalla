import { cookies } from 'next/headers'

const handler = async () => {
  const cookieList = await cookies()
  return new Response(cookieList.toString(), {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

export { handler as GET, handler as POST }
