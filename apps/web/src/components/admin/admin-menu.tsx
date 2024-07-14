"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@//components/ui/button";

export function AdminMenu() {
  return (
    <div className="w-[220px]">
      <div className="bg-background h-full min-h-screen gap-y-2 border-e sm:flex sm:flex-col">
        <div className="flex h-12 items-center justify-center border-b font-mono text-lg font-semibold">
          Valhalla Admin
        </div>
        <nav className="flex flex-col gap-1 px-2">
          <p className="text-muted-foreground mb-1 mt-2 px-2 text-xs font-semibold uppercase">
            Functions
          </p>
          <Item value="users" label="Users" />
        </nav>
        <nav className="flex flex-col gap-1 px-2">
          <p className="text-muted-foreground mb-1 mt-2 px-2 text-xs font-semibold uppercase">
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
      className="h-7 w-full justify-start px-2"
      asChild
    >
      <Link href={`/admin/${value}`}>{decodeURIComponent(label)}</Link>
    </Button>
  );
}
