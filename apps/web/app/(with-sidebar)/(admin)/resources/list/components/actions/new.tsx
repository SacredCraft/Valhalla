'use client'

import { PlusIcon } from 'lucide-react'

import { Button } from '@valhalla/design-system/components/ui/button'

export const NewResourceAction = () => {
  return (
    <Button size="sm">
      <PlusIcon />
      新建资源
    </Button>
  )
}
