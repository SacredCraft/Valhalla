import { parseAsInteger, useQueryState } from 'nuqs'

export const useTabs = () => {
  const [currentTabIndex, setCurrentTabIndex] = useQueryState(
    'tab',
    parseAsInteger.withDefault(0)
  )

  return {
    currentTabIndex,
    setCurrentTabIndex,
  }
}
