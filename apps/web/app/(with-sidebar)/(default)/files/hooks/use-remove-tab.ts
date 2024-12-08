'use client'

import { useFileTabsStore } from '@/providers/file-tabs-provider'

import { useTabs } from './use-tabs'

export const useRemoveTab = () => {
  const { removeTab } = useFileTabsStore((state) => state)
  const { currentTabIndex, setCurrentTabIndex } = useTabs()

  const handleRemoveTab = (tabIndex: number) => {
    if (tabIndex === currentTabIndex) {
      setCurrentTabIndex(tabIndex - 1)
    } else if (tabIndex < currentTabIndex) {
      setCurrentTabIndex(currentTabIndex - 1)
    }
    removeTab(tabIndex)
  }

  return handleRemoveTab
}

export const useRemoveOtherTabs = () => {
  const { removeOtherTabs } = useFileTabsStore((state) => state)

  return removeOtherTabs
}

export const useRemoveAllTabs = () => {
  const { removeAllTabs } = useFileTabsStore((state) => state)

  return removeAllTabs
}
