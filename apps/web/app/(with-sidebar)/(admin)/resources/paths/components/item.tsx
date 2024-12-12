import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { pathsSchema } from '@valhalla/api/router/paths.schemas'
import { Button } from '@valhalla/design-system/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@valhalla/design-system/components/ui/card'
import { Form, FormField } from '@valhalla/design-system/components/ui/form'
import { Input } from '@valhalla/design-system/components/ui/input'
import { Skeleton } from '@valhalla/design-system/components/ui/skeleton'
import { toast } from '@valhalla/design-system/components/ui/sonner'

import { orpc } from '@/lib/orpc/react'

const formSchema = z.object({
  resourceName: z.string(),
  data: pathsSchema,
})

export const PathsItem = ({
  resourceName,
  paths,
}: {
  resourceName: string
  paths: { path: string; name: string }[]
}) => {
  const { data: resource } = orpc.resources.get.useQuery({ name: resourceName })
  const utils = orpc.useUtils()
  const { mutate: updatePaths } = orpc.paths.update.useMutation({
    onSuccess: () => {
      toast.success('保存成功')
      utils.paths.list.invalidate()
      utils.resources.folders.invalidate()
      utils.files.list.invalidate()
    },
    onError: () => {
      toast.error('保存失败')
    },
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resourceName,
      data: paths,
    },
  })

  const renderPaths = form.watch('data')

  function onSubmit(values: z.infer<typeof formSchema>) {
    updatePaths(values)
  }

  function insertPath() {
    form.setValue('data', [...form.getValues('data'), { path: '', name: '' }])
  }

  function removePath(index: number) {
    form.setValue(
      'data',
      form.getValues('data').filter((_, i) => i !== index)
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="rounded-none border-x border-b-0 border-t shadow-none">
          <CardHeader>
            <CardTitle>
              {resource?.label}
              <span className="ml-2 text-muted-foreground">{resourceName}</span>
            </CardTitle>
            <CardDescription>
              请在下方输入路径和名称，以便我们能够更好地管理资源。
            </CardDescription>
          </CardHeader>
          {renderPaths.length > 0 && (
            <CardContent className="space-y-4">
              {renderPaths.map((path, index) => (
                <div key={index} className="flex items-center gap-2">
                  <PathsItemNameFormItem index={index} form={form} />
                  <PathsItemPathFormItem index={index} form={form} />
                  <Button
                    type="button"
                    className="size-9"
                    variant="destructive"
                    onClick={() => removePath(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <FormMessage form={form} />
            </CardContent>
          )}
          <CardFooter className="flex items-center gap-2">
            <Button>保存</Button>
            <Button type="button" variant="outline" onClick={insertPath}>
              插入
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

const PathsItemPathFormItem = ({
  index,
  form,
}: {
  index: number
  form: UseFormReturn<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={form.control}
      name={`data.${index}.path`}
      render={({ field }) => <Input placeholder="路径" {...field} />}
    />
  )
}

const PathsItemNameFormItem = ({
  index,
  form,
}: {
  index: number
  form: UseFormReturn<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={form.control}
      name={`data.${index}.name`}
      render={({ field }) => (
        <Input className="max-w-40" placeholder="名称" {...field} />
      )}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findMessage(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return null
  }

  if ('message' in obj) {
    return obj.message
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const result = findMessage(obj[key])
      if (result !== null) {
        return result
      }
    }
  }

  return null
}

const FormMessage = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
}) => {
  const message = useMemo(() => {
    const error = form.formState.errors
    return findMessage(error)
  }, [form.formState.errors])

  return <p className="text-[0.8rem] font-medium text-destructive">{message}</p>
}

export const PathsItemSkeleton = () => {
  return <Skeleton className="h-56 w-full" />
}
