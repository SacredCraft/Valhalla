"use client";

import { TrashIcon } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";

import { useBrowserContext } from "@/app/plugins/[plugin]/browser/layout.client";
import { Trash, emptyTrash } from "@/lib/core";

import { BrowserHeader } from "@/components/plugin/browser/browser-header";
import { BrowserTabs } from "@/components/plugin/browser/browser-tabs";
import { Button } from "@/components/ui/button";

type TrashClientLayoutProps = {
  trash: Trash[];
  children?: React.ReactNode;
};

export function TrashClientLayout({ trash, children }: TrashClientLayoutProps) {
  const { setTrash, plugin, setRelativePath } = useBrowserContext();

  useEffect(() => {
    setTrash?.(trash);
  }, [setTrash, trash]);

  useEffect(() => {
    setRelativePath?.(undefined);
  }, [setRelativePath]);

  return (
    <>
      <BrowserHeader />
      <BrowserTabs
        actions={
          <Button
            size="sm"
            variant="destructive"
            className="h-7 px-2"
            onClick={() => {
              emptyTrash(plugin.id).then(() => {
                toast.success("Trash bin emptied");
              });
            }}
          >
            <TrashIcon className="mr-1 h-4 w-4" />
            Empty Trash Bin
          </Button>
        }
      />
      {children}
    </>
  );
}
