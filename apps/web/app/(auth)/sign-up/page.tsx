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
  ConfirmPasswordFormItem,
  EmailFormItem,
  PasswordFormItem,
  SignUpForm,
  SubmitButton,
  UsernameFormItem,
} from './page.client'

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect('/dashboard')
  }

  return (
    <SignUpForm className="flex items-center bg-sidebar text-sidebar-foreground max-sm:w-full sm:rounded-xl">
      <div
        className="hidden items-center justify-center md:block"
        style={{
          width: '640px',
        }}
      />
      <ValhallaAuthCard className="flex min-h-[460px] w-full flex-col rounded-none border-none shadow-none max-md:min-w-96 sm:max-w-xs sm:rounded-xl md:m-2">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription>Start using our services</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col justify-center space-y-2">
          <UsernameFormItem />
          <EmailFormItem />
          <PasswordFormItem />
          <ConfirmPasswordFormItem />
        </CardContent>

        <CardFooter className="mt-auto flex flex-col items-center gap-2">
          <SubmitButton />
          <LoginLink />
        </CardFooter>
      </ValhallaAuthCard>
    </SignUpForm>
  )
}

const LoginLink = () => {
  return (
    <p className="text-center text-sm text-muted-foreground">
      Already have an account?{' '}
      <Link
        href="/sign-in"
        className="font-medium text-primary hover:text-primary/90"
      >
        Login
      </Link>
    </p>
  )
}
