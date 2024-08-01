"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { useAside } from "@/app/(main)/_components/aside";
import { Button } from "@sacred-craft/valhalla-components";

export function AdminMenu() {
  const { collapsed } = useAside();
  return (
    <motion.div
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      layout
      layoutDependency={collapsed}
      className="w-[220px] fixed left-[var(--aside-width)]"
    >
      <div className="bg-background sm:flex border-e sm:flex-col gap-y-2 min-h-screen h-full">
        <div className="h-12 flex items-center justify-center border-b font-semibold font-mono text-lg">
          Valhalla Admin
        </div>
        <nav className="flex flex-col gap-1 px-2">
          <p className="text-muted-foreground text-xs font-semibold uppercase px-2 mb-1 mt-2">
            Main
          </p>
          <Item value="users" label="Users" />
          <Item value="resource-roles" label="Roles" />
        </nav>
        <nav className="flex flex-col gap-1 px-2">
          <p className="text-muted-foreground text-xs font-semibold uppercase px-2 mb-1 mt-2">
            Settings
          </p>
          <Item value="resource-path" label="Resource Path" />
        </nav>
      </div>
    </motion.div>
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
