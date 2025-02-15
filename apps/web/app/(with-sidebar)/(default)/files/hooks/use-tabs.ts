import { parseAsInteger, useQueryState } from 'nuqs'

import { useFileTabsStore } from '@/providers/file-tabs-provider'

export const useTabs = () => {
  const [currentTabIndex, setCurrentTabIndex] = useQueryState(
    'tab',
    parseAsInteger.withDefault(0)
  )
  const { tabs } = useFileTabsStore((state) => state)

  const safeSetCurrentTabIndex = (index: number) => {
    // 确保索引在有效范围内
    if (tabs.length === 0) {
      setCurrentTabIndex(0)
      return
    }

    const safeIndex = Math.max(0, Math.min(index, tabs.length - 1))
    setCurrentTabIndex(safeIndex)
  }

  return {
    currentTabIndex,
    setCurrentTabIndex: safeSetCurrentTabIndex,
  }
}
