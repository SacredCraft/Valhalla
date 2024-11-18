'use client'

import type React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormStatus } from 'react-dom'
import { useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@valhalla/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@valhalla/ui/form'
import { Input } from '@valhalla/ui/input'
import { toast } from '@valhalla/ui/sonner'

import { signIn } from '@/lib/auth/client'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
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

      callbackURL: '/',

      fetchOptions: {
        onError(e) {
          toast.error(e.error.message)
        },

        onSuccess() {
          toast.success('Logged in successfully')
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
          <FormLabel>Email Address</FormLabel>
          <FormControl>
            <Input
              type="email"
              className="focus:border-primary"
              placeholder="your@email.com"
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
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input
              type="password"
              className="focus:border-primary"
              placeholder="••••••••"
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
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  )
}

export { SignInForm, EmailFormItem, PasswordFormItem, SubmitButton }
