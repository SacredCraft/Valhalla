import { useFileTabsStore } from '@/providers/file-tabs-provider'

import { useTabs } from './use-tabs'

export const useAddTabs = () => {
  const { addTab } = useFileTabsStore((state) => state)
  const { setCurrentTabIndex } = useTabs()

  const handleAddTab = (tab: Parameters<typeof addTab>[0]) => {
    const newTabIndex = addTab(tab)
    setCurrentTabIndex(newTabIndex)
  }

  return handleAddTab
}
