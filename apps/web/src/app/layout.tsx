import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import localFont from "next/font/local";

import Providers from "@/app/_components/providers";
import "@/styles/globals.css";
import { HydrateClient } from "@/trpc/server";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Valhalla | SacredFrontier Resource Management Platform",
  description: "开拓者资源管理平台（Valhalla Hub）",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full bg-muted/40 font-sans`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <HydrateClient>
              <div className="flex min-h-full flex-col">{children}</div>
            </HydrateClient>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
