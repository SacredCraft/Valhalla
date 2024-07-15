import { redirect } from "next/navigation";
import React from "react";

import { FilesHeader } from "@/app/(main)/plugins/[plugin]/files/_components/files-header";
import { FilesTabs } from "@/app/(main)/plugins/[plugin]/files/_components/files-tabs";
import FilesInfoClientLayout from "@/app/(main)/plugins/[plugin]/files/info/[...path]/layout.client";
import { api } from "@/trpc/server";

type FilesInfoLayoutProps = {
  params: {
    plugin: string;
    path?: string[];
  };
  children: React.ReactNode;
};

export default async function FilesInfoLayout({
  params: { plugin: pluginId, path: relativePath = [] },
  children,
}: FilesInfoLayoutProps) {
  const file = await api.files.getPluginFile({
    id: pluginId,
    relativePath: relativePath.map((i) => decodeURIComponent(i)),
  });

  if (!file || file.type === "dir") {
    redirect(`/plugins/${pluginId}/browser/explore/${relativePath.join("/")}`);
  }

  return (
    <FilesInfoClientLayout relativePath={relativePath} file={file}>
      <FilesHeader />
      <FilesTabs />
      {children}
    </FilesInfoClientLayout>
  );
}
