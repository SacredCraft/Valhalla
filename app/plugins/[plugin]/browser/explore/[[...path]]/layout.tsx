import React from "react";

import { getPluginFiles } from "@/app/actions";
import { ExploreClientLayout } from "@/app/plugins/[plugin]/browser/explore/[[...path]]/layout.client";

import { BrowserHeader } from "@/components/plugin/browser/browser-header";
import { BrowserTabs } from "@/components/plugin/browser/browser-tabs";
import { New } from "@/components/plugin/browser/new";
import { Upload } from "@/components/plugin/browser/upload";
import { FileUploader } from "@/components/ui/file-uploader";

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
        actions={
          <>
            <New />
            <Upload />
          </>
        }
      />
      {children}
    </ExploreClientLayout>
  );
}
