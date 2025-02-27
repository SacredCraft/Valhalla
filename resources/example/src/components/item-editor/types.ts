import { ColumnDef, Table } from '@tanstack/react-table'

// 基础物品类型
export type Item = {
  display: string
  icon: {
    base: string
    file: string
  }
  quality: number
  name: string
  description: string
  meta: {
    'hide-all': boolean
  }
  'item-type': string
}

// 物品配置映射
export type ItemConfig = {
  [key: string]: Item
}

// 编辑器额外数据
export type ItemEditorExtra = {
  files: {
    [key: string]: File
  }
}

// 编辑器上下文类型
export type ItemEditorContextType = {
  currentItem: ItemWithId | null
  setCurrentItem: (item: ItemWithId | null) => void
  parsedContent: ItemConfig | null
  setParsedContent: (content: ItemConfig) => void
  saveCurrentItem: (item: Item & { id: string }) => void
  extra: ItemEditorExtra
  setExtra: (extra: ItemEditorExtra) => void
}

// 带ID的物品类型
export type ItemWithId = {
  id: string
  data: Item
}

// 数据表行类型
export type ItemRow = ItemWithId

// 数据表操作属性
export interface DataTableActionsProps {
  table: Table<ItemRow>
}

// 数据表工具栏属性
export interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

// 数据表属性
export interface DataTableProps<TValue> {
  columns: ColumnDef<ItemRow, TValue>[]
  data: ItemRow[]
}

// 物品编辑器属性
export type ItemEditorProps = {
  item: ItemWithId | null
}
