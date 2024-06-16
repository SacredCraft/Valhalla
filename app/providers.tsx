"use client";

import { Provider as JotaiProvider } from "jotai";
import { useState } from "react";
import { Toaster } from "sonner";

import { HeaderContext, HeaderItem } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [items, setItems] = useState<HeaderItem[]>();
  return (
    <>
      <Toaster />
      <JotaiProvider>
        <HeaderContext.Provider
          value={{
            items,
            setItems,
          }}
        >
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </HeaderContext.Provider>
      </JotaiProvider>
    </>
  );
}
