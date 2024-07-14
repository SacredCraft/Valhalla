import { notFound, redirect } from "next/navigation";
import React from "react";

import FilesInfoClientLayout from "@/app/(main)/plugins/[plugin]/files/info/[...path]/layout.client";
import { getFile } from "@/app/actions";

import { FilesHeader } from "@/components/plugin/files/files-header";
import { FilesTabs } from "@/components/plugin/files/files-tabs";

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
  const file = await getFile(
    pluginId,
    relativePath.map((i) => decodeURIComponent(i)).join("/"),
  );

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
