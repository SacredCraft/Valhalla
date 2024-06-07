"use client";

import { Provider as JotaiProvider } from "jotai";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Toaster />
      <JotaiProvider>
        <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
      </JotaiProvider>
    </>
  );
}
