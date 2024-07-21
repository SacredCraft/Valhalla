"use client";

import { Copy } from "lucide-react";

import { useBrowserContext } from "@/app/(main)/resources/[resource]/browser/layout.client";
import { Button, toast } from "@sacred-craft/valhalla-components";

export function CopyCurrentPath() {
  const { relativePath } = useBrowserContext();

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 px-2"
      onClick={() => {
        navigator.clipboard
          .writeText(`/${relativePath?.join("/")}`)
          .then(() => toast.success("Path copied to clipboard"));
      }}
    >
      <Copy className="mr-1 h-4 w-4" />
      Copy Path
    </Button>
  );
}
