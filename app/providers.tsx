"use client";

import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
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
  );
}
