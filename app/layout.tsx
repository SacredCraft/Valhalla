import localFont from "next/font/local";

import type { Metadata } from "next";

import { RootClientLayout } from "@/app/layout.client";

import { Aside } from "@/components/layout/aside";

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
            <RootClientLayout>{children}</RootClientLayout>
          </div>
        </Providers>
      </body>
    </html>
  );
}
