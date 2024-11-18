import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@valhalla/auth'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@valhalla/ui/card'

import { ValhallaAuthCard } from '@/components/val-auth-card'

import {
  EmailFormItem,
  PasswordFormItem,
  SignInForm,
  SubmitButton,
} from './page.client'

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect('/dashboard')
  }

  return (
    <SignInForm className="flex items-center bg-sidebar text-sidebar-foreground max-sm:w-full sm:rounded-xl">
      <div
        className="hidden items-center justify-center md:block"
        style={{
          width: '640px',
        }}
      />
      <ValhallaAuthCard className="flex min-h-[500px] w-full flex-col rounded-none border-none shadow-none max-md:min-w-96 sm:max-w-xs sm:rounded-xl md:m-2">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold tracking-tight">
            Login
          </CardTitle>
          <CardDescription>Welcome back to our services</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col justify-center space-y-2">
          <EmailFormItem />
          <PasswordFormItem />
        </CardContent>

        <CardFooter className="mt-auto flex flex-col items-center gap-2">
          <SubmitButton />
          <RegisterLink />
        </CardFooter>
      </ValhallaAuthCard>
    </SignInForm>
  )
}

const RegisterLink = () => {
  return (
    <p className="text-center text-sm text-muted-foreground">
      Don&apos;t have an account?{' '}
      <Link
        href="/sign-up"
        className="font-medium text-primary hover:text-primary/90"
      >
        Register
      </Link>
    </p>
  )
}
