import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { Control, useForm } from 'react-hook-form'
import { z } from 'zod'

import { createUserSchema } from '@valhalla/api/router/users.schemas'
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

import { RoleItem } from './shared'

const formSchema = createUserSchema

export function CreateUserButton() {
  const [open, setOpen] = useState(false)
  const utils = orpc.useUtils()
  const { mutate: createUser, isPending } = orpc.users.createUser.useMutation({
    onSuccess: () => {
      toast.success('创建成功')
      utils.users.list.invalidate()
      setOpen(false)
    },
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="sm">
          <Plus className="size-4" />
          新建用户
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>新建用户</SheetTitle>
          <SheetDescription>新建用户，并为其分配角色</SheetDescription>
        </SheetHeader>
        <CreateUserForm createUser={createUser}>
          <SheetFooter>
            <FormSubmit isPending={isPending} />
            <SheetClose asChild>
              <Button type="button" variant="outline">
                取消
              </Button>
            </SheetClose>
          </SheetFooter>
        </CreateUserForm>
      </SheetContent>
    </Sheet>
  )
}

function CreateUserForm({
  children,
  createUser,
}: {
  children: React.ReactNode
  createUser: (values: z.infer<typeof formSchema>) => void
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createUser(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormName control={form.control} />
        <FormEmail control={form.control} />
        <FormPassword control={form.control} />
        <FormRole control={form.control} />
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
          <FormLabel>用户名</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const FormEmail = ({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>邮箱</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const FormPassword = ({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>
}) => {
  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>密码</FormLabel>
          <FormControl>
            <Input type="password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const FormRole = ({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>
}) => {
  return <RoleItem control={control} />
}

const FormSubmit = ({ isPending }: { isPending: boolean }) => {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? '创建中...' : '创建'}
    </Button>
  )
}
