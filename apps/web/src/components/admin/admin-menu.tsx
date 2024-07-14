"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";

export function AdminMenu() {
  return (
    <div className="w-[220px]">
      <div className="bg-background sm:flex border-e sm:flex-col gap-y-2 min-h-screen h-full">
        <div className="h-12 flex items-center justify-center border-b font-semibold font-mono text-lg">
          Valhalla Admin
        </div>
        <nav className="flex flex-col gap-1 px-2">
          <p className="text-muted-foreground text-xs font-semibold uppercase px-2 mb-1 mt-2">
            Functions
          </p>
          <Item value="users" label="Users" />
        </nav>
        <nav className="flex flex-col gap-1 px-2">
          <p className="text-muted-foreground text-xs font-semibold uppercase px-2 mb-1 mt-2">
            Settings
          </p>
          <Item value="plugin-path" label="Plugin Path" />
        </nav>
      </div>
    </div>
  );
}

function Item({ value, label }: { value: string; label: string }) {
  const pathname = usePathname();

  const isActive = useMemo(
    () => pathname.split("/")[2] === value,
    [pathname, value],
  );

  return (
    <Button
      size="sm"
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start h-7 px-2"
      asChild
    >
      <Link href={`/admin/${value}`}>{decodeURIComponent(label)}</Link>
    </Button>
  );
}
