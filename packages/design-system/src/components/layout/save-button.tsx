import { SaveIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useResourceContent } from '@valhalla/design-system/resources/providers/resource-content-provider'
import { useResourceCore } from '@valhalla/design-system/resources/providers/resource-core-provider'
import { cn } from '@valhalla/design-system/utils/cn'

export const SaveButton = ({ cache }: { cache: string }) => {
  const { isModified } = useResourceCore()
  const { saveResourceContent } = useResourceContent()

  return (
    <button
      onClick={() => {
        toast.promise(saveResourceContent(cache ?? ''), {
          loading: '保存中...',
          success: '保存成功',
          error: '保存失败',
        })
      }}
      className={cn(
        'fixed bottom-4 right-8 p-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-lg transition-all duration-200 rounded-full',
        !isModified ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
    >
      <SaveIcon className="w-4 h-4" />
    </button>
  )
}
