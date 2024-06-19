import Link from "next/link";
import { usePathname } from "next/navigation";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";

type BrowserTabsProps = {
  actions?: React.ReactNode;
};

export function BrowserTabs({ actions }: BrowserTabsProps) {
  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative">
      <div>{actions}</div>
      <nav className="flex items-center justify-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <BrowserTab value="explore" label="Files" />
        <BrowserTab value="trash" label="Trash" />
      </nav>
    </div>
  );
}

function BrowserTab({ value, label }: { value: string; label: string }) {
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
        href={
          value === "explore"
            ? isActive
              ? pathname
              : `/plugins/${pathnameSliced[2]}/browser/explore`
            : `/plugins/${pathnameSliced[2]}/browser/${value}`
        }
      >
        {label}
      </Link>
    </Button>
  );
}
