'use client'

import { createContext, useContext, useState } from 'react'
import type React from 'react'
import { createORPCClient } from '@orpc/client'
import { createORPCReact } from '@orpc/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { getBaseUrl } from '@valhalla/utils/url'

import { router } from './router'

export const { orpc, ORPCContext } = createORPCReact<typeof router>()

const createQueryClient = () => new QueryClient()

let clientQueryClientSingleton: QueryClient | undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    return createQueryClient()
  }
  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = createQueryClient()
  }
  return clientQueryClientSingleton
}

const ORPCClientContext = createContext<
  ReturnType<typeof createORPCClient<typeof router>> | undefined
>(undefined)

export const useORPCClient = () => {
  const client = useContext(ORPCClientContext)
  if (!client) {
    throw new Error('ORPCClient not found')
  }
  return client
}

/**
 * This component is used to initialize the orpc & react-query pairing on the client side.
 * @param props The props to the component.
 * @param props.children The children to render.
 * @returns react-query and trpc providers wrapper around the children.
 */
export function ORPCProvider(props: { children: React.ReactNode }) {
  const [client] = useState(() =>
    createORPCClient<typeof router>({
      baseURL: `${getBaseUrl()}/api`,
    })
  )
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ORPCClientContext.Provider value={client}>
        <ORPCContext.Provider
          value={{
            client,
            queryClient,
          }}
        >
          {props.children}
        </ORPCContext.Provider>
      </ORPCClientContext.Provider>
    </QueryClientProvider>
  )
}
