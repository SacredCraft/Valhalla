'use client'

import type React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
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

import { signUp } from '@/lib/auth/client'

const schema = z
  .object({
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
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

      callbackURL: '/',

      fetchOptions: {
        onError(e) {
          toast.error(e.error.message)
        },

        onSuccess() {
          toast.success('Account created successfully')
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
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input
              className="focus:border-primary"
              placeholder="John Doe"
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
          <FormLabel>Confirm Password</FormLabel>
          <FormControl>
            <Input
              type="password"
              className="focus:border-primary"
              placeholder="••••••••"
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
      {formState.isSubmitting ? 'Creating account...' : 'Create Account'}
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
