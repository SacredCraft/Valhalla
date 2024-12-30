import { useState } from 'react'
import { User } from 'better-auth'
import { CheckIcon, PlusIcon } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

import { Button } from '@valhalla/design-system/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@valhalla/design-system/components/ui/dialog'
import { Input } from '@valhalla/design-system/components/ui/input'

import { orpc } from '@/lib/orpc/react'

import { ValhallaUserAvatar } from './ui/val-user-avatar'

export function UserSelect({
  children,
  value,
  onChange,
}: {
  children: React.ReactNode
  value: User[]
  onChange: (value: User[]) => void
}) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value)
  }, 300)

  const { data: users } = orpc.users.list.useQuery({
    search: debouncedSearch,
  })

  const handleSelect = (user: User) => {
    if (value.includes(user)) {
      onChange(value.filter((u) => u.id !== user.id))
    } else {
      onChange([...value, user])
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>选择用户</DialogTitle>
          <DialogDescription>选择用户</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="搜索用户"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            debouncedSetSearch(e.target.value)
          }}
        />
        <div className="flex flex-col gap-2">
          {users?.map((user) => (
            <UserSelectItem
              key={user.id}
              user={user}
              selected={value.includes(user)}
              onSelect={() => handleSelect(user)}
            />
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>确定</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function UserSelectItem({
  user,
  selected,
  onSelect,
}: {
  user: User
  selected: boolean
  onSelect: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted p-2">
      <div className="flex items-center gap-2">
        <ValhallaUserAvatar userId={user.id} />
        <div className="flex flex-col">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Button variant="outline" size="icon" onClick={onSelect}>
        {selected ? <CheckIcon /> : <PlusIcon />}
      </Button>
    </div>
  )
}
