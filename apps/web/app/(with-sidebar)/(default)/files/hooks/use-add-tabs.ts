import { parseAsInteger, useQueryState } from 'nuqs'

import { useFileTabsStore } from '@/providers/file-tabs-provider'

export const useAddTabs = () => {
  const { addTab } = useFileTabsStore((state) => state)
  const [, setCurrentTabIndex] = useQueryState(
    'tab',
    parseAsInteger.withDefault(0)
  )

  const handleAddTab = (tab: Parameters<typeof addTab>[0]) => {
    const newTabIndex = addTab(tab)
    setCurrentTabIndex(newTabIndex)
  }

  return handleAddTab
}
