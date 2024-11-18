'use client'

import { useQuery } from '@tanstack/react-query'

export default function ValFileTree() {
  const { data } = useQuery({
    queryKey: ['files'],
    queryFn: () => fetch('/api/files').then((res) => res.json()),
  })
}
