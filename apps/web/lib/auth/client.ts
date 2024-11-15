import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { toast } from '@valhalla/ui/sonner'

export const authClient = createAuthClient({
  plugins: [adminClient()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error('Too many requests. Please try again later.')
      }
    },
  },
})

export const { signUp, signIn, signOut, useSession } = authClient
