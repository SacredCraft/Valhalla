"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@//components/ui/button";

type FilesTabsProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function FilesTabs({ left, right }: FilesTabsProps) {
  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative">
      <div className="flex gap-2">{left}</div>
      <nav className="flex items-center justify-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <FilesTab value="info" label="Info" />
        <FilesTab value="editor" label="Editor" />
        <FilesTab value="raw" label="Raw" />
      </nav>
      <div className="flex gap-2">{right}</div>
    </div>
  );
}

function FilesTab({ value, label }: { value: string; label: string }) {
  const pathname = usePathname();
  const pathnameSliced = useMemo(() => pathname.split("/"), [pathname]);
  const isActive = useMemo(
    () => pathname.split("/")[4] === value,
    [pathname, value],
  );

  return (
    <Button
      size="sm"
      variant={isActive ? "default" : "ghost"}
      className="w-full justify-start h-7"
      asChild
    >
      <Link
        href={`/plugins/${pathnameSliced[2]}/files/${value}/${pathnameSliced.slice(5).join("/")}`}
      >
        {label}
      </Link>
    </Button>
  );
}
