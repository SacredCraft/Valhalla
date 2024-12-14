import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserWithRole } from 'better-auth/plugins'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Control, useForm } from 'react-hook-form'
import { z } from 'zod'

import { updateUserSchema } from '@valhalla/api/router/users.schemas'
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
import { Label } from '@valhalla/design-system/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@valhalla/design-system/components/ui/sheet'
import { toast } from '@valhalla/design-system/components/ui/sonner'

import {
  AvatarUploader,
  AvatarUploaderButton,
  AvatarUploaderDescription,
  AvatarUploaderDisplay,
} from '@/components/ui/avatar-uploader'
import { orpc } from '@/lib/orpc/react'

import { RoleItem } from './shared'

const formSchema = updateUserSchema.omit({ id: true })

export function EditUser({ user }: { user: UserWithRole }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          编辑
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>编辑用户</SheetTitle>
          <SheetDescription>
            请确保所有必填字段都已填写，并在完成后点击保存按钮。
          </SheetDescription>
        </SheetHeader>
        <EditUserForm setOpen={setOpen} user={user} />
      </SheetContent>
    </Sheet>
  )
}

function EditUserForm({
  user,
  setOpen,
}: {
  user: UserWithRole
  setOpen: (open: boolean) => void
}) {
  const utils = orpc.useUtils()
  const { data: image } = orpc.avatar.get.useQuery({ userId: user.id })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role as 'admin' | 'user',
      password: '',
      image: undefined,
    },
  })

  const { mutate: updateUser, isPending } = orpc.users.updateUser.useMutation({
    onSuccess: () => {
      utils.users.invalidate()
      utils.avatar.invalidate()
      toast.success('更新成功')
      setOpen(false)
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateUser({ ...data, id: user.id })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <UserIdField user={user} />
        <AvatarField control={form.control} image={image} />
        <UserField control={form.control} />
        <EmailField control={form.control} />
        <PasswordField control={form.control} />
        <RoleField control={form.control} />

        <SheetFooter>
          <SubmitButton isPending={isPending} />
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            取消
          </Button>
        </SheetFooter>
      </form>
    </Form>
  )
}

const UserIdField = ({ user }: { user: UserWithRole }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(user.id)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="space-y-2">
      <Label>用户 ID</Label>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {user.id}
        <span className="cursor-pointer" onClick={handleCopy}>
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CheckIcon className="size-3" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CopyIcon className="size-3" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>
    </div>
  )
}

const AvatarField = ({
  control,
  image,
}: {
  control: Control<z.infer<typeof formSchema>>
  image: Buffer | undefined
}) => {
  const imageUrl = image
    ? `data:image/jpeg;base64,${Buffer.from(image).toString('base64')}`
    : undefined

  return (
    <FormField
      control={control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>头像</FormLabel>
          <FormControl>
            <AvatarUploader
              className="py-4"
              src={imageUrl}
              avatar={field.value}
              setAvatar={field.onChange}
            >
              <AvatarUploaderDisplay />
              <AvatarUploaderButton>上传头像</AvatarUploaderButton>
              <AvatarUploaderDescription>
                或将图片拖放到此处
              </AvatarUploaderDescription>
            </AvatarUploader>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const UserField = ({
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

const EmailField = ({
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

const PasswordField = ({
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

const RoleField = ({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>
}) => {
  return <RoleItem control={control} />
}

const SubmitButton = ({ isPending }: { isPending: boolean }) => {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? '保存中...' : '保存'}
    </Button>
  )
}
