"use client";

import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "@/trpc/react";

import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: Readonly) {
  return (
    <TRPCReactProvider>
      <JotaiProvider>
        <Toaster />
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </NextThemesProvider>
      </JotaiProvider>
    </TRPCReactProvider>
  );
}
