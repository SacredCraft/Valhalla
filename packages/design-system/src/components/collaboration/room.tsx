/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { User } from 'better-auth/types'
import ky from 'ky'

import { useResourceCore } from '@valhalla/design-system/resources/providers/resource-core-provider'

import { OnlineAvatars } from './online-avatars'

type ContextType = {
  provider: HocuspocusProvider
  roomName: string
  cookies: string
  user: User
  selfAwareness: any
  otherAwareness: any[]

  setSelfAwareness: (selfAwareness: any) => void

  usersAwareness: any[]

  setUsersAwareness: (usersAwareness: any[]) => void
}

const RoomContext = createContext<ContextType | null>(null)

export const useRoom = () => {
  const context = useContext(RoomContext)

  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider')
  }

  return context
}

export const Room = ({ children }: { children?: React.ReactNode }) => {
  const { fileName, filePath } = useResourceCore()
  const [cookies, setCookies] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    ky.get('/api/collaboration/cookies').text().then(setCookies)
    ky.get('/api/collaboration/profile').json<User>().then(setUser)
  }, [])

  return (
    cookies &&
    user && (
      <RoomInner
        cookies={cookies}
        user={user}
        roomName={`${fileName} ${filePath}`}
      >
        {children}
      </RoomInner>
    )
  )
}

const RoomInner = ({
  roomName,
  children,
  cookies,
  user,
}: {
  roomName: string
  children?: React.ReactNode
  cookies: string
  user: User
}) => {
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null)

  const [_selfAwareness, setSelfAwareness] = useState<any>(null)

  const [usersAwareness, setUsersAwareness] = useState<any[]>([])

  const selfAwareness = useMemo(() => {
    return {
      ..._selfAwareness,
      clientID: provider?.awareness?.clientID,
    }
  }, [_selfAwareness, provider])

  const otherAwareness = useMemo(() => {
    return usersAwareness.filter(
      (user) => user.clientID !== selfAwareness?.clientID
    )
  }, [usersAwareness, selfAwareness])

  useEffect(() => {
    provider?.awareness?.setLocalStateField('user', _selfAwareness)
  }, [_selfAwareness])

  useEffect(() => {
    function setUsers() {
      const users = (provider?.awareness?.getStates() ?? []).entries()
      const array = Array.from(users).map(([clientID, state]) => ({
        ...state.user,
        clientID,
      }))

      setUsersAwareness(array)
    }

    provider?.awareness?.on('change', setUsers)
    setUsers()

    return () => {
      provider?.awareness?.off('change', setUsers)
    }
  }, [provider])

  useEffect(() => {
    const provider = new HocuspocusProvider({
      url: getBaseUrl(),
      name: roomName,
      token: cookies,
    })

    setProvider(provider)

    return () => {
      provider?.destroy()
    }
  }, [roomName])

  return (
    provider && (
      <RoomContext.Provider
        value={{
          provider,
          roomName,
          cookies,
          user,
          selfAwareness,
          otherAwareness,
          setSelfAwareness,
          usersAwareness,
          setUsersAwareness,
        }}
      >
        {children}
        <OnlineAvatars />
      </RoomContext.Provider>
    )
  )
}

function getBaseUrl() {
  if (typeof window !== 'undefined')
    return window.location.origin.replace(/^http/, 'ws')
  if (process.env.VERCEL_URL) return `ws://${process.env.VERCEL_URL}`
  return `ws://localhost:${process.env.PORT ?? 3000}`
}
