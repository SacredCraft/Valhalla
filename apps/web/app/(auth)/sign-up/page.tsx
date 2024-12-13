import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@valhalla/auth'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@valhalla/design-system/components/ui/card'

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
    <SignUpForm className="flex size-full max-h-[42rem] max-w-6xl items-center overflow-hidden border-4 border-card bg-card text-card-foreground sm:m-4 sm:rounded-3xl md:m-8 lg:m-12">
      <div className="relative h-full w-1/2 overflow-hidden rounded-r-[32px] max-md:hidden">
        <Image
          src="/auth-background.jpg?height=1080&width=1920"
          alt="Auth background"
          layout="fill"
          objectFit="cover"
          objectPosition="left center"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 p-8 text-white">
          <div className="mb-20 text-sm uppercase tracking-wider">Valhalla</div>
          <h1 className="mb-4 font-serif text-6xl">
            做你
            <br />
            想做的
            <br />
            一切
          </h1>
          <p className="text-sm opacity-80">
            注册 Valhalla 开始你的旅程
            <br />
            一切尽在掌握
          </p>
        </div>
      </div>
      <ValhallaAuthCard className="flex h-full flex-col rounded-r-[2rem] border-none shadow-none md:w-1/2">
        <CardHeader className="text-center">
          <Image
            src="/logo.png"
            alt="Valhalla"
            width={75}
            height={75}
            className="mx-auto"
          />
        </CardHeader>

        <CardContent className="mx-auto flex flex-1 flex-col justify-center space-y-8">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-center font-serif text-3xl font-bold tracking-tight">
              创建账号
            </CardTitle>
            <CardDescription className="text-center">
              开始使用我们的服务
            </CardDescription>
          </div>
          <div className="flex min-w-80 flex-col gap-2">
            <UsernameFormItem />
            <EmailFormItem />
            <PasswordFormItem />
            <ConfirmPasswordFormItem />
          </div>
          <SubmitButton />
        </CardContent>

        <CardFooter className="mt-auto flex flex-col items-center gap-2">
          <LoginLink />
        </CardFooter>
      </ValhallaAuthCard>
    </SignUpForm>
  )
}

const LoginLink = () => {
  return (
    <p className="text-center text-sm text-muted-foreground">
      已有账号？{' '}
      <Link href="/" className="font-medium text-primary hover:text-primary/90">
        登录
      </Link>
    </p>
  )
}
