import localFont from "next/font/local";

import type { Metadata } from "next";

import { Aside } from "@/components/layout/aside";
import { Header } from "@/components/layout/header";

import "./globals.css";
import Providers from "./providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <div className="flex min-h-screen w-full flex-col bg-muted/40 font-sans">
            <Aside />
            <div className="flex flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <Header />
              <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
