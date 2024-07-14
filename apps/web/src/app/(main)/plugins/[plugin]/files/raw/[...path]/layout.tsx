import { notFound, redirect } from "next/navigation";
import React from "react";

import { FilesHeader } from "@/app/(main)/plugins/[plugin]/files/_components/files-header";
import { FilesTabs } from "@/app/(main)/plugins/[plugin]/files/_components/files-tabs";
import FilesRawClientLayout from "@/app/(main)/plugins/[plugin]/files/raw/[...path]/layout.client";
import { getFile } from "@/app/actions";

type FilesRawLayoutProps = {
  params: {
    plugin: string;
    path?: string[];
  };
  children: React.ReactNode;
};

export default async function FilesRawLayout({
  params: { plugin: pluginId, path: relativePath = [] },
  children,
}: FilesRawLayoutProps) {
  const file = await getFile(
    pluginId,
    relativePath.map((i) => decodeURIComponent(i)).join("/"),
  );

  if (!file || file.type === "dir") {
    redirect(`/plugins/${pluginId}/browser/explore/${relativePath.join("/")}`);
  }

  return (
    <FilesRawClientLayout relativePath={relativePath} file={file}>
      <FilesHeader />
      <FilesTabs />
      {children}
    </FilesRawClientLayout>
  );
}
