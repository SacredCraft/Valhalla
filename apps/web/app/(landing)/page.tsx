import type React from 'react'
import { headers } from 'next/headers'
import Link from 'next/link'

import { auth } from '@valhalla/auth'
import { Button } from '@valhalla/ui/button'
import { RainbowButton } from '@valhalla/ui/rainbow-button'
import { Skeleton } from '@valhalla/ui/skeleton'

import { api } from '@/lib/trpc/server'

export default async function HomePage() {
  // Fetch sponsors data from API in React Server Component (RSC)
  const sponsors = await api.sponsors.getSponsors()
  return (
    <main className="container">
      <Introduction>
        <IntroductionLeft>
          <IntroductionTitle>欢迎使用 Valhalla</IntroductionTitle>
          <IntroductionDescription>
            Valhalla 是一个开源、基于
            Web、多功能、可扩展、可定制、易于使用的资源管理平台。
            旨在为团队提供一个统一的、一站式的资源管理平台,
            帮助团队更好地管理资源、提高工作效率、降低成本。
          </IntroductionDescription>
          <IntroductionActions>
            <GetStartedItem />
            <IntroductionActionLink href="/docs">
              <IntroductionAction
                className="h-11 rounded-xl px-6 text-base font-medium"
                variant="outline"
              >
                文档
              </IntroductionAction>
            </IntroductionActionLink>
          </IntroductionActions>
        </IntroductionLeft>
        <IntroductionRight>
          <IntroductionPreview />
        </IntroductionRight>
      </Introduction>
      <Sponsors>
        <SponsorsTitle>赞助商</SponsorsTitle>
        <SponsorsDescription>感谢所有赞助商的支持！</SponsorsDescription>
        <SponsorsList>
          {sponsors.map((sponsor) => (
            <SponsorsListItem key={sponsor.url} href={sponsor.url}>
              {sponsor.name}
            </SponsorsListItem>
          ))}
        </SponsorsList>
      </Sponsors>
    </main>
  )
}

const Introduction = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-28 flex gap-x-12">{children}</div>
}

const IntroductionLeft = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full space-y-4 md:w-[55%]">{children}</div>
}

const IntroductionRight = ({ children }: { children: React.ReactNode }) => {
  return <div className="hidden w-[45%] items-center md:flex">{children}</div>
}

const IntroductionTitle = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-4xl font-bold">{children}</h1>
}

const IntroductionDescription = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <p className="text-lg text-muted-foreground">{children}</p>
}

const IntroductionActions = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2 pt-4">{children}</div>
}

const IntroductionAction = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) => {
  return <Button {...props}>{children}</Button>
}

const IntroductionActionLink = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) => {
  return <Link {...props}>{children}</Link>
}

const IntroductionPreview = () => {
  return <Skeleton className="h-[240px] w-full" />
}

const GetStartedItem = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <IntroductionActionLink href={session ? '/dashboard' : '/sign-in'}>
      <RainbowButton>{session ? '仪表盘' : '开始使用'}</RainbowButton>
    </IntroductionActionLink>
  )
}

const Sponsors = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-28 space-y-4">{children}</div>
}

const SponsorsTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-2xl font-bold">{children}</h2>
}

const SponsorsDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-lg text-muted-foreground">{children}</p>
}

const SponsorsList = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-4 md:grid-cols-4">
      {children}
    </div>
  )
}

const SponsorsListItem = ({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) => {
  return (
    <Link href={href}>
      <div className="flex h-20 cursor-pointer items-center justify-center rounded-lg bg-accent px-4 font-mono text-2xl font-medium text-accent-foreground transition-colors duration-300 hover:bg-primary hover:text-primary-foreground">
        {children}
      </div>
    </Link>
  )
}
