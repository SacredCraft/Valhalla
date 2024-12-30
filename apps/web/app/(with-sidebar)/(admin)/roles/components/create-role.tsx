import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { Control, useForm } from 'react-hook-form'
import { z } from 'zod'

import { createRoleSchema } from '@valhalla/api/router/resources.schemas'
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@valhalla/design-system/components/ui/sheet'
import { toast } from '@valhalla/design-system/components/ui/sonner'

import { orpc } from '@/lib/orpc/react'

const formSchema = createRoleSchema

export function CreateRoleButton() {
  const [open, setOpen] = useState(false)
  const utils = orpc.useUtils()
  const { mutate: createRole, isPending } =
    orpc.resources.createRole.useMutation({
      onSuccess: () => {
        toast.success('创建成功')
        utils.resources.roles.invalidate()
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="sm">
          <Plus className="size-4" />
          新建角色
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>新建角色</SheetTitle>
          <SheetDescription>新建角色，并为其分配资源</SheetDescription>
        </SheetHeader>
        <CreateRoleForm createRole={createRole}>
          <SheetFooter>
            <FormSubmit isPending={isPending} />
            <SheetClose asChild>
              <Button type="button" variant="outline">
                取消
              </Button>
            </SheetClose>
          </SheetFooter>
        </CreateRoleForm>
      </SheetContent>
    </Sheet>
  )
}

function CreateRoleForm({
  children,
  createRole,
}: {
  children: React.ReactNode
  createRole: (values: z.infer<typeof formSchema>) => void
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      resources: [],
      users: [],
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createRole(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormName control={form.control} />
        <FormDescription control={form.control} />
        <FormResources control={form.control} />
        <FormUsers control={form.control} />
        {children}
      </form>
    </Form>
  )
}

const FormName = ({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>角色名</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const FormDescription = ({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>描述</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const FormResources = ({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={control}
      name="resources"
      render={({ field }) => (
        <FormItem>
          <FormLabel>资源</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const FormUsers = ({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={control}
      name="users"
      render={({ field }) => (
        <FormItem>
          <FormLabel>用户</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const FormSubmit = ({ isPending }: { isPending: boolean }) => {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? '创建中...' : '创建'}
    </Button>
  )
}
