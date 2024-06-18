import Link from "next/link";

import { Settings } from "lucide-react";
import React from "react";

import { plugins } from "@/config/plugins";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Aside() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <span className="text-center font-mono tracking-widest transition-all group-hover:scale-110">
            V
          </span>
          <span className="sr-only">Valhalla</span>
        </Link>
        {plugins.map((plugin) => (
          <Tooltip key={plugin.id}>
            <TooltipTrigger asChild>
              <Link
                href={`/${plugin.id}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <plugin.icon className="h-5 w-5" />
                <span className="sr-only">{plugin.name}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{plugin.name}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
