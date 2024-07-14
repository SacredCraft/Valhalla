import React from "react";

import { BrowserHeader } from "@/app/(main)/plugins/[plugin]/browser/_components/browser-header";
import { BrowserTabs } from "@/app/(main)/plugins/[plugin]/browser/_components/browser-tabs";
import { CopyCurrentPath } from "@/app/(main)/plugins/[plugin]/browser/explore/[[...path]]/_components/copy-current-path";
import { PasteAction } from "@/app/(main)/plugins/[plugin]/browser/explore/[[...path]]/_components/copy-cut";
import { New } from "@/app/(main)/plugins/[plugin]/browser/explore/[[...path]]/_components/new";
import { Upload } from "@/app/(main)/plugins/[plugin]/browser/explore/[[...path]]/_components/upload";
import { ExploreClientLayout } from "@/app/(main)/plugins/[plugin]/browser/explore/[[...path]]/layout.client";
import { getPluginFiles } from "@/app/actions";

type BrowserLayoutProps = {
  params: {
    plugin: string;
    path?: string[];
  };
  children: React.ReactNode;
};

export default async function ExploreLayout({
  params: { plugin: pluginId, path: relativePath = [] },
  children,
}: BrowserLayoutProps) {
  const files = (await getPluginFiles(pluginId, relativePath)) ?? [];

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
