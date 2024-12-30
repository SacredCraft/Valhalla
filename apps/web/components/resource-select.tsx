import { useState } from 'react'
import { CheckIcon, PlusIcon } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

import { orpc } from '@valhalla/api/react'
import { Resource } from '@valhalla/core/schema/resource'
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

export function ResourceSelect({
  children,
  value,
  onChange,
}: {
  children: React.ReactNode
  value: string[]
  onChange: (value: string[]) => void
}) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value)
  }, 300)

  const { data: resources } = orpc.resources.list.useQuery({
    search: debouncedSearch,
  })

  const handleSelect = (resource: Resource) => {
    if (value.includes(resource.name)) {
      onChange(value.filter((name) => name !== resource.name))
    } else {
      onChange([...value, resource.name])
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>资源选择</DialogTitle>
          <DialogDescription>选择一个资源</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="搜索资源"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            debouncedSetSearch(e.target.value)
          }}
        />
        <div className="flex flex-col gap-2">
          {resources?.map((resource) => (
            <ResourceSelectItem
              key={resource.name}
              resource={resource}
              selected={value.includes(resource.name)}
              onSelect={() => handleSelect(resource)}
            />
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setSearch('')}>
              取消
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>确定</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ResourceSelectItem({
  resource,
  selected,
  onSelect,
}: {
  resource: Resource
  selected: boolean
  onSelect: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted p-2">
      {resource.name}
      <Button variant="outline" size="icon" onClick={onSelect}>
        {selected ? <CheckIcon /> : <PlusIcon />}
      </Button>
    </div>
  )
}
