'use client'

import type React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormStatus } from 'react-dom'
import { useForm, useFormContext } from 'react-hook-form'
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
import { toast } from '@valhalla/design-system/components/ui/sonner'

import { signIn } from '@/lib/auth/client'

const schema = z.object({
  email: z.string().email('无效的邮箱'),
  password: z.string().min(8, '密码至少8位'),
})

const SignInForm = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const { email, password } = data
    await signIn.email({
      email,
      password,

      callbackURL: '/dashboard',

      fetchOptions: {
        onError() {
          toast.error('登录失败，请检查邮箱和密码')
        },

        onSuccess() {
          toast.success('登录成功')
          form.reset()
        },
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </Form>
  )
}

const EmailFormItem = () => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>邮箱</FormLabel>
          <FormControl>
            <Input
              type="email"
              className="focus:border-primary"
              placeholder="输入你的邮箱"
              autoComplete="email"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const PasswordFormItem = () => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>密码</FormLabel>
          <FormControl>
            <Input
              type="password"
              className="focus:border-primary"
              placeholder="输入你的密码"
              autoComplete="current-password"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SubmitButton = () => {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? '登录中...' : '登录'}
    </Button>
  )
}

export { SignInForm, EmailFormItem, PasswordFormItem, SubmitButton }
