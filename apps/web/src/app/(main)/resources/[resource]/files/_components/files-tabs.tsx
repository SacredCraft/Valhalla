"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@sacred-craft/valhalla-components";
import { useResourceFileContext } from "@sacred-craft/valhalla-resource-components";

type FilesTabsProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function FilesTabs({ left, right }: FilesTabsProps) {
  const { template } = useResourceFileContext();

  const items = template.options?.render;

  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative">
      <div className="flex gap-2">{left}</div>
      <nav className="flex items-center justify-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {items &&
          items.map((item) => (
            <FilesTab key={item.value} value={item.value} label={item.label} />
          ))}
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
        href={`/resources/${pathnameSliced[2]}/files/${value}/${pathnameSliced.slice(5).join("/")}`}
      >
        {label}
      </Link>
    </Button>
  );
}
