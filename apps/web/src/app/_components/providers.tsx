"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster, TooltipProvider } from "@sacred-craft/valhalla-components";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <Toaster />
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
      </NextThemesProvider>
    </TRPCReactProvider>
  );
}
