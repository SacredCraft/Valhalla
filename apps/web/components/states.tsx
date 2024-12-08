import Link from 'next/link'
import { Loader2, RefreshCcw } from 'lucide-react'

import { Button } from '@valhalla/design-system/components/ui/button'

const CrossIcon = () => (
  <svg
    className="size-10 text-muted-foreground"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

const EmptyState = () => {
  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4">
      <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
        <CrossIcon />
      </div>
      <div className="max-w-[420px] text-center">
        <h3 className="mb-2 text-lg font-semibold">暂无数据</h3>
        <p className="text-sm text-muted-foreground">
          看起来这里还没有任何内容。开始添加一些内容,让这里变得丰富起来吧!
        </p>
      </div>
    </div>
  )
}

const LoadingState = () => {
  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4">
      <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
        <Loader2 className="size-10 animate-spin text-muted-foreground" />
      </div>
      <div className="max-w-[420px] text-center">
        <h3 className="mb-2 text-lg font-semibold">加载中</h3>
        <p className="text-sm text-muted-foreground">正在加载数据，请稍候...</p>
      </div>
    </div>
  )
}

const ErrorState = ({
  message = '加载数据失败，请稍后再试。',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) => {
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-4">
      <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
        <CrossIcon />
      </div>
      <div className="flex max-w-[420px] flex-col items-center gap-2 text-center">
        <h3 className="mb-2 text-lg font-semibold">遇到了一些问题</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button className="mt-2 w-fit" onClick={onRetry}>
            <RefreshCcw className="size-4" />
            重试
          </Button>
        )}
      </div>
    </div>
  )
}

const NotFoundState = () => {
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-4">
      <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
        <CrossIcon />
      </div>
      <div className="flex max-w-[420px] flex-col items-center gap-2 text-center">
        <h3 className="mb-2 text-lg font-semibold">页面未找到</h3>
        <p className="text-sm text-muted-foreground">
          看起来您访问的页面不存在。
        </p>
        <Button className="mt-2 w-fit" asChild>
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </div>
  )
}

const UnauthorizedState = () => {
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-4">
      <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
        <CrossIcon />
      </div>
      <div className="flex max-w-[420px] flex-col items-center gap-2 text-center">
        <h3 className="mb-2 text-lg font-semibold">未授权</h3>
        <p className="text-sm text-muted-foreground">
          看起来您没有权限访问该页面。
        </p>
      </div>
    </div>
  )
}

const NotFoundFileState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
        <CrossIcon />
      </div>
      <div className="flex max-w-[420px] flex-col items-center gap-2 text-center">
        <h3 className="mb-2 text-lg font-semibold">文件不存在</h3>
        <p className="text-sm text-muted-foreground">
          看起来您访问的文件不存在。
        </p>
      </div>
    </div>
  )
}

const NotFoundLayoutState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
        <CrossIcon />
      </div>
      <div className="flex max-w-[420px] flex-col items-center gap-2 text-center">
        <h3 className="mb-2 text-lg font-semibold">Layout 不存在</h3>
        <p className="text-sm text-muted-foreground">
          看起来您访问的 Layout 不存在。
        </p>
      </div>
    </div>
  )
}

export {
  EmptyState,
  LoadingState,
  ErrorState,
  NotFoundState,
  UnauthorizedState,
  NotFoundFileState,
  NotFoundLayoutState,
}
