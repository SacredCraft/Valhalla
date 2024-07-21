"use client";

import { TrashIcon } from "lucide-react";
import React, { useEffect } from "react";

import { BrowserHeader } from "@/app/(main)/resources/[resource]/browser/_components/browser-header";
import { BrowserTabs } from "@/app/(main)/resources/[resource]/browser/_components/browser-tabs";
import { useBrowserContext } from "@/app/(main)/resources/[resource]/browser/layout.client";
import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { Trash, emptyTrash } from "@/lib/core";
import { Button, toast } from "@sacred-craft/valhalla-components";

type TrashClientLayoutProps = {
  trash: Trash[];
  children?: React.ReactNode;
};

export function TrashClientLayout({ trash, children }: TrashClientLayoutProps) {
  const { setTrash, setRelativePath } = useBrowserContext();
  const { resource } = useResourceContext();

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
        left={
          <Button
            size="sm"
            variant="destructive"
            className="h-7 px-2"
            onClick={() => {
              emptyTrash(resource.name).then(() => {
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
