'use client'

import { useFileTabsStore } from '@/providers/file-tabs-provider'

import { useTabs } from './use-tabs'

export const useRemoveTab = () => {
  const { removeTab, tabs } = useFileTabsStore((state) => state)
  const { currentTabIndex, setCurrentTabIndex } = useTabs()

  const handleRemoveTab = (tabIndex: number) => {
    if (tabs.length === 0) return

    // 删除标签前确定新的活动标签
    let newIndex = currentTabIndex
    if (tabIndex === currentTabIndex) {
      // 如果删除的是当前标签，优先选择左侧标签
      newIndex = Math.max(0, tabIndex - 1)
    } else if (tabIndex < currentTabIndex) {
      // 如果删除的标签在当前标签左侧，当前标签索引需要减1
      newIndex = currentTabIndex - 1
    }

    removeTab(tabIndex)
    setCurrentTabIndex(newIndex)
  }

  return handleRemoveTab
}

export const useRemoveOtherTabs = () => {
  const { removeOtherTabs, tabs } = useFileTabsStore((state) => state)
  const { setCurrentTabIndex } = useTabs()

  return (index: number) => {
    if (tabs.length === 0) return
    removeOtherTabs(index)
    setCurrentTabIndex(0)
  }
}

export const useRemoveAllTabs = () => {
  const { removeAllTabs } = useFileTabsStore((state) => state)
  const { setCurrentTabIndex } = useTabs()

  return () => {
    removeAllTabs()
    setCurrentTabIndex(0)
  }
}
