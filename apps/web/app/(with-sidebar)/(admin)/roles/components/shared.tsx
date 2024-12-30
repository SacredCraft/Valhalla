import { User } from 'better-auth'
import { XIcon } from 'lucide-react'

import { Button } from '@valhalla/design-system/components/ui/button'

import { ValhallaUserAvatar } from '@/components/ui/val-user-avatar'

export function UserList({
  users,
  setUsers,
}: {
  users: User[]
  setUsers: (users: User[]) => void
}) {
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">无用户</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="group flex w-full items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <ValhallaUserAvatar userId={user.id} />
            <div className="flex flex-col">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setUsers(users.filter((u) => u.id !== user.id))
            }}
            variant="outline"
            size="icon"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
