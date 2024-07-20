import React from "react";

import { BrowserHeader } from "@/app/(main)/resources/[resource]/browser/_components/browser-header";
import { BrowserTabs } from "@/app/(main)/resources/[resource]/browser/_components/browser-tabs";
import { CopyCurrentPath } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/copy-current-path";
import { PasteAction } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/copy-cut";
import { New } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/new";
import { Upload } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/upload";
import { ExploreClientLayout } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/layout.client";
import { api } from "@/trpc/server";

type BrowserLayoutProps = {
  params: {
    resource: string;
    path?: string[];
  };
  children: React.ReactNode;
};

export default async function ExploreLayout({
  params: { resource: resourceName, path: relativePath = [] },
  children,
}: BrowserLayoutProps) {
  const files =
    (await api.files.getResourceFiles({
      name: resourceName,
      relativePath: relativePath.map((i) => decodeURIComponent(i)),
    })) ?? [];

  return (
    <ExploreClientLayout relativePath={relativePath} files={files}>
      <BrowserHeader />
      <BrowserTabs
        left={
          <>
            <New />
            <Upload />
            <PasteAction />
          </>
        }
        right={
          <>
            <CopyCurrentPath />
          </>
        }
      />
      {children}
    </ExploreClientLayout>
  );
}
