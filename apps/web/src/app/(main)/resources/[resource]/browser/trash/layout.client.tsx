"use client";

import React, { useEffect } from "react";

import { BrowserHeader } from "@/app/(main)/resources/[resource]/browser/_components/browser-header";
import { BrowserTabs } from "@/app/(main)/resources/[resource]/browser/_components/browser-tabs";
import { useBrowserContext } from "@/app/(main)/resources/[resource]/browser/layout.client";
import { Trash } from "@/server/api/routers/files";

import { DeleteAll } from "./_components/delete-all";
import { RestoreAll } from "./_components/restore-all";

type TrashClientLayoutProps = {
  trash: Trash[];
  children?: React.ReactNode;
};

export function TrashClientLayout({ trash, children }: TrashClientLayoutProps) {
  const { setTrash, setRelativePath } = useBrowserContext();

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
        left={<></>}
        right={
          <>
            <RestoreAll />
            <DeleteAll />
          </>
        }
      />
      {children}
    </>
  );
}
