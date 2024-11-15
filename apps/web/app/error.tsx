'use client'

import { ErrorState } from '@/components/states'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      message={error.message || '遇到了一些问题，请稍后再试。'}
      onRetry={() => reset()}
    />
  )
}
