'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Save, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@valhalla/design-system/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@valhalla/design-system/components/ui/form'
import { Input } from '@valhalla/design-system/components/ui/input'
import { ScrollArea } from '@valhalla/design-system/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@valhalla/design-system/components/ui/select'

import { Item } from './columns'
import { useItemEditor } from './hooks'

// quality 映射
const qualityMap = {
  '1': '粗糙',
  '2': '普通',
  '3': '奇巧',
  '4': '精粹',
  '5': '稀有',
  '6': '极品',
  '7': '传说',
  '8': '圣器',
}

type ItemEditorProps = {
  item: Item | null
}

const formSchema = z.any()

export const ItemDetailsEditor = ({ item }: ItemEditorProps) => {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="border-l border-t w-[420px] rounded-tl-3xl"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          <ScrollArea className="h-[calc(100svh-85px)]">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Edit className="w-4 h-4" /> 物品编辑
                </h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <ItemEditorForm item={item} />
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const ItemEditorForm = ({ item }: ItemEditorProps) => {
  const { parsedContent } = useItemEditor()
  const id = Object.keys(parsedContent ?? {}).find(
    (key) => parsedContent?.[key].name === item?.name
  )
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...item,
      id,
      quality: item?.quality === 0 ? '1' : item?.quality.toString(),
      category: 'weapon',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Group label="基本参数">
          <ID form={form} />
          <DisplayName form={form} />
        </Group>
        <Group label="物品类型">
          <Quality form={form} />
          <Category form={form} />
          <ItemType form={form} />
        </Group>
      </form>
    </Form>
  )
}

const Group = ({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) => {
  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div className="flex gap-4">{children}</div>
    </div>
  )
}

const ID = ({ form }: { form: UseFormReturn<z.infer<typeof formSchema>> }) => {
  return (
    <FormField
      control={form.control}
      name="id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>ID</FormLabel>
          <FormControl>
            <Input placeholder="编辑 ID" required {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const DisplayName = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={form.control}
      name="display"
      render={({ field }) => (
        <FormItem>
          <FormLabel>显示名称</FormLabel>
          <FormControl>
            <Input placeholder="编辑显示名称" required {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const Quality = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={form.control}
      name="quality"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>品质</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger>
                <SelectValue placeholder="品质" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(qualityMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const Category = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>分类</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger>
                <SelectValue placeholder="分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weapon">武器</SelectItem>
                <SelectItem value="armor">防具</SelectItem>
                <SelectItem value="consumable">消耗品</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

const ItemType = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={form.control}
      name="itemType"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>物品类型</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger>
                <SelectValue placeholder="物品类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wood">木材</SelectItem>
                <SelectItem value="stone">石材</SelectItem>
                <SelectItem value="iron">铁材</SelectItem>
                <SelectItem value="gold">金材</SelectItem>
                <SelectItem value="diamond">钻石</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
