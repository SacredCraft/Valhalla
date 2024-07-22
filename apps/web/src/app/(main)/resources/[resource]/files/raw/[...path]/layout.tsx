import { redirect } from "next/navigation";
import React from "react";

import { FilesHeader } from "@/app/(main)/resources/[resource]/files/_components/files-header";
import { FilesTabs } from "@/app/(main)/resources/[resource]/files/_components/files-tabs";
import FilesRawClientLayout from "@/app/(main)/resources/[resource]/files/raw/[...path]/layout.client";
import { api } from "@/trpc/server";

type FilesRawLayoutProps = {
  params: {
    resource: string;
    path?: string[];
  };
  children: React.ReactNode;
};

export default async function FilesRawLayout({
  params: { resource, path: relativePath = [] },
  children,
}: FilesRawLayoutProps) {
  const file = await api.files.getResourceFile({
    resource: resource,
    relativePath: relativePath.map((i) => decodeURIComponent(i)),
  });

  if (!file || file.type === "dir") {
    redirect(
      `/resources/${resource}/browser/explore/${relativePath.join("/")}`,
    );
  }

  return (
    <FilesRawClientLayout relativePath={relativePath} file={file}>
      <FilesHeader />
      <FilesTabs />
      {children}
    </FilesRawClientLayout>
  );
}
