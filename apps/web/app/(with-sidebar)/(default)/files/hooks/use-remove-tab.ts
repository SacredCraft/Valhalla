'use client'

import { useFileTabsStore } from '@/providers/file-tabs-provider'

import { useTabs } from './use-tabs'

export const useRemoveTab = () => {
  const { removeTab, tabs } = useFileTabsStore((state) => state)
  const { currentTabIndex, setCurrentTabIndex } = useTabs()

  const handleRemoveTab = (tabIndex: number) => {
    if (tabs.length === 0) return

    // 检查标签是否被修改过
    const tab = tabs[tabIndex]
    if (tab.isModified) {
      const confirmed = window.confirm(
        `文件 ${tab.fileName} 已修改，确定要关闭吗？`
      )
      if (!confirmed) {
        return
      }
    }

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

    // 检查是否有被修改的标签
    const modifiedTabs = tabs.filter((tab, i) => i !== index && tab.isModified)
    if (modifiedTabs.length > 0) {
      const fileNames = modifiedTabs.map((tab) => tab.fileName).join(', ')
      const confirmed = window.confirm(
        `以下文件已修改: ${fileNames}，确定要关闭吗？`
      )
      if (!confirmed) {
        return
      }
    }

    removeOtherTabs(index)
    setCurrentTabIndex(0)
  }
}

export const useRemoveAllTabs = () => {
  const { removeAllTabs, tabs } = useFileTabsStore((state) => state)
  const { setCurrentTabIndex } = useTabs()

  return () => {
    // 检查是否有被修改的标签
    const modifiedTabs = tabs.filter((tab) => tab.isModified)
    if (modifiedTabs.length > 0) {
      const fileNames = modifiedTabs.map((tab) => tab.fileName).join(', ')
      const confirmed = window.confirm(
        `以下文件已修改: ${fileNames}，确定要关闭吗？`
      )
      if (!confirmed) {
        return
      }
    }

    removeAllTabs()
    setCurrentTabIndex(0)
  }
}
