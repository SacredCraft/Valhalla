"use client";

import { Copy } from "lucide-react";

import { Button, toast } from "@sacred-craft/valhalla-components";

import { useExploreContext } from "../layout.client";

export function CopyCurrentPath() {
  const { relativePath } = useExploreContext();

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
