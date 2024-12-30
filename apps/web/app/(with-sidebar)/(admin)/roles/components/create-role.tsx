import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'better-auth'
import { Plus, PlusIcon, XIcon } from 'lucide-react'
import { Control, useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { createRoleSchema } from '@valhalla/api/router/resources.schemas'
import { Badge } from '@valhalla/design-system/components/ui/badge'
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

import { ResourceSelect } from '@/components/resource-select'
import { UserSelect } from '@/components/user-select'
import { orpc } from '@/lib/orpc/react'

import { UserList } from './shared'

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
        <FormUsers control={form.control} form={form} />
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
          <FormLabel className="flex items-center justify-between">
            资源
            <ResourceSelect {...field}>
              <Button variant="ghost" className="size-8" size="icon">
                <PlusIcon className="size-4" />
              </Button>
            </ResourceSelect>
          </FormLabel>
          <FormControl>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {field.value.map((resource) => (
                  <Badge className="group gap-1" key={resource}>
                    {resource}
                    <XIcon
                      onClick={() => {
                        field.onChange(
                          field.value.filter((r) => r !== resource)
                        )
                      }}
                      className="hidden size-3 cursor-pointer group-hover:block"
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const FormUsers = ({
  control,
  form,
}: {
  control: Control<z.infer<typeof formSchema>>
  form: UseFormReturn<z.infer<typeof formSchema>>
}) => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    form.setValue(
      'users',
      users.map((user) => user.id)
    )
  }, [form, users])

  return (
    <FormField
      control={control}
      name="users"
      render={() => (
        <FormItem>
          <FormLabel className="flex items-center justify-between">
            用户
            <UserSelect
              value={users}
              onChange={(user) => {
                setUsers(user)
              }}
            >
              <Button variant="ghost" className="size-8" size="icon">
                <PlusIcon className="size-4" />
              </Button>
            </UserSelect>
          </FormLabel>
          <FormControl>
            <UserList users={users} setUsers={setUsers} />
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
