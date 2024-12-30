import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Control, useForm } from 'react-hook-form'
import { z } from 'zod'

import { updateRoleSchema } from '@valhalla/api/router/resources.schemas'
import { ResourceRoleWithUsersAndResources } from '@valhalla/db/schema'
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

import { orpc } from '@/lib/orpc/react'

const formSchema = updateRoleSchema.omit({ id: true })

export function EditRole({
  role,
}: {
  role: ResourceRoleWithUsersAndResources
}) {
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
          <SheetTitle>编辑角色</SheetTitle>
          <SheetDescription>
            请确保所有必填字段都已填写，并在完成后点击保存按钮。
          </SheetDescription>
        </SheetHeader>
        <EditRoleForm setOpen={setOpen} role={role} />
      </SheetContent>
    </Sheet>
  )
}

function EditRoleForm({
  role,
  setOpen,
}: {
  role: ResourceRoleWithUsersAndResources
  setOpen: (open: boolean) => void
}) {
  const utils = orpc.useUtils()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role.name,
      description: role.description ?? undefined,
      resources: role.resources,
      users: role.users,
    },
  })

  const { mutate: updateRole, isPending } =
    orpc.resources.updateRole.useMutation({
      onSuccess: () => {
        utils.resources.roles.invalidate()
        toast.success('更新成功')
        setOpen(false)
      },
    })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateRole({ ...data, id: role.id })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RoleIdField role={role} />
        <RoleNameField control={form.control} />
        <RoleDescriptionField control={form.control} />

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

const RoleIdField = ({ role }: { role: ResourceRoleWithUsersAndResources }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(role.id)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="space-y-2">
      <Label>角色 ID</Label>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {role.id}
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

const RoleNameField = ({
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
          <FormLabel>角色名称</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const RoleDescriptionField = ({
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
          <FormLabel>角色描述</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SubmitButton = ({ isPending }: { isPending: boolean }) => {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? '保存中...' : '保存'}
    </Button>
  )
}
