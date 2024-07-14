"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { useBrowserContext } from "@/app/(main)/plugins/[plugin]/browser/layout.client";

import { Button } from "@/components/ui/button";

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
