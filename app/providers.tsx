"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

import { AsideContext } from "@/components/layout/aside";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [collapsed, setCollapsed] = useState<boolean>();

  useEffect(() => {
    setCollapsed(localStorage.getItem("aside-collapsed") === "true");
  }, []);

  return (
    <>
      <Toaster />
      <AsideContext.Provider value={{ collapsed, setCollapsed }}>
        <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
      </AsideContext.Provider>
    </>
  );
}
