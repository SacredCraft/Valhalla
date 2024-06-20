"use client";

import { atomWithStorage } from "jotai/utils";

import { Provider as JotaiProvider, useAtom } from "jotai";
import { Toaster } from "sonner";

import { AsideContext } from "@/components/layout/aside";
import { TooltipProvider } from "@/components/ui/tooltip";

const collapsedAtom = atomWithStorage<boolean>("aside-collapsed", false);

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [collapsed, setCollapsed] = useAtom(collapsedAtom);

  return (
    <JotaiProvider>
      <Toaster />
      <AsideContext.Provider value={{ collapsed, setCollapsed }}>
        <TooltipProvider delayDuration={100}>
          {collapsed !== undefined && children}
        </TooltipProvider>
      </AsideContext.Provider>
    </JotaiProvider>
  );
}
