import { useFileTabsStore } from '@/providers/file-tabs-provider'

import { useTabs } from './use-tabs'

export const useAddTabs = () => {
  const { addTab, tabs } = useFileTabsStore((state) => state)
  const { setCurrentTabIndex } = useTabs()

  const handleAddTab = (tab: Parameters<typeof addTab>[0]) => {
    // 检查是否已存在相同的标签
    const existingIndex = tabs.findIndex(
      (t) =>
        t.filePath === tab.filePath &&
        t.fileName === tab.fileName &&
        t.resourceName === tab.resourceName &&
        t.resourceFolder === tab.resourceFolder
    )

    if (existingIndex !== -1) {
      // 如果标签已存在，直接切换到该标签
      setCurrentTabIndex(existingIndex, true)
      return existingIndex
    }

    // 先添加新标签
    addTab(tab)
    // 获取新的标签索引（因为 addTab 是异步的，所以需要重新获取 tabs.length）
    const newTabIndex = tabs.length
    // 设置当前标签为新添加的标签
    setTimeout(() => {
      setCurrentTabIndex(newTabIndex, true)
    }, 0)

    return newTabIndex
  }

  return handleAddTab
}
