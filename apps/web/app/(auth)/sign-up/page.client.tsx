'use client'

import type React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
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

import { signUp } from '@/lib/auth/client'

const schema = z
  .object({
    username: z.string().min(1, '用户名不能为空'),
    email: z.string().email('无效的邮箱'),
    password: z.string().min(8, '密码至少8位'),
    confirmPassword: z.string().min(8, '密码至少8位'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

const SignUpForm = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const { username, email, password } = data
    await signUp.email({
      name: username,
      email,
      password,

      callbackURL: '/dashboard',

      fetchOptions: {
        onError(e) {
          toast.error(e.error.message)
        },

        onSuccess() {
          toast.success('注册成功')
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

const UsernameFormItem = () => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>用户名</FormLabel>
          <FormControl>
            <Input
              className="focus:border-primary"
              placeholder="输入你的用户名"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
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
              autoComplete="new-password"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const ConfirmPasswordFormItem = () => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>确认密码</FormLabel>
          <FormControl>
            <Input
              type="password"
              className="focus:border-primary"
              placeholder="再次输入密码"
              autoComplete="new-password"
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
  const { formState } = useFormContext()
  return (
    <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
      {formState.isSubmitting ? '创建账号中...' : '创建账号'}
    </Button>
  )
}

export {
  ConfirmPasswordFormItem,
  EmailFormItem,
  PasswordFormItem,
  SignUpForm,
  UsernameFormItem,
  SubmitButton,
}
