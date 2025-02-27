'use client'

import path from 'path'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Save, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { orpc } from '@valhalla/api/react'
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
import { toast } from '@valhalla/design-system/components/ui/sonner'
import { useResourceCore } from '@valhalla/design-system/resources/providers/resource-core-provider'
import { cn } from '@valhalla/design-system/utils/cn'

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
  const { setCurrentItem } = useItemEditor()
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
            <div className="p-4">
              <ItemEditorForm item={item}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Edit className="w-4 h-4" /> 物品编辑
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" type="submit">
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => setCurrentItem(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ItemEditorForm>
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const ItemEditorForm = ({
  item,
  children,
}: ItemEditorProps & { children: React.ReactNode }) => {
  const { parsedContent, setCurrentItem, saveCurrentItem, extra } =
    useItemEditor()
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
  const { mutate: uploadFile } = orpc.files.upload.useMutation()
  const { filePath, resourceName, resourceFolder } = useResourceCore()
  const folder = path.dirname(filePath)

  function onSubmit(values: z.infer<typeof formSchema>) {
    setCurrentItem(values)
    saveCurrentItem()
    if (extra.files[values.icon.file]) {
      uploadFile({
        targetPath: path.join(folder, values.icon.file),
        file: extra.files[values.icon.file],
        resourceName: resourceName,
        resourceFolder: resourceFolder,
      })
    }
    toast.success('保存成功')
  }

  useEffect(() => {
    console.log(parsedContent)
  }, [parsedContent])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {children}
        <div className="space-y-8">
          <Group label="基本参数">
            <ID form={form} />
            <DisplayName form={form} />
          </Group>
          <Group label="物品类型">
            <Quality form={form} />
            <Category form={form} />
            <ItemType form={form} />
          </Group>
          <Group label="贴图材质">
            <TwoDIcon form={form} />
          </Group>
        </div>
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

const TwoDIcon = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
}) => {
  const { extra, setExtra } = useItemEditor()
  const { filePath, resourceName, resourceFolder } = useResourceCore()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const folder = path.dirname(filePath)
  const iconPath = path.join(folder, form.getValues('icon.file'), '@2d.png')
  const { data } = orpc.files.read.useQuery({
    filePath: iconPath,
    fileName: '@2d.png',
    resourceName: resourceName,
    resourceFolder: resourceFolder,
    readFileOptions: {
      encoding: 'base64',
    },
  })

  useEffect(() => {
    if (data) {
      setImageUrl(`data:image/png;base64,${data}`)
    }
  }, [data])

  const handleChange = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string)
      form.setValue('icon.file', file.name)
      setExtra({
        ...extra,
        files: {
          ...extra.files,
          [file.name]: file,
        },
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <FormField
      control={form.control}
      name="icon.file"
      render={() => (
        <FormItem>
          <FormLabel>2D</FormLabel>
          <FormControl>
            <UploadIcon className="size-12" onChange={handleChange}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="2D 图标"
                  width={48}
                  height={48}
                  className="rounded-md object-cover aspect-square w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-md" />
              )}
            </UploadIcon>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

const UploadIcon = ({
  children,
  onChange,
  className,
}: {
  children: React.ReactNode
  onChange: (file: File) => void
  className?: string
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <button
        className={cn(
          'border rounded p-1 w-fit block hover:bg-gray-50',
          className
        )}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {children}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onChange(file)
          }
        }}
      />
    </>
  )
}
