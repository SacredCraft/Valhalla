import { redirect } from "next/navigation";
import React from "react";

import { FilesHeader } from "@/app/(main)/resources/[resource]/files/_components/files-header";
import { FilesTabs } from "@/app/(main)/resources/[resource]/files/_components/files-tabs";
import FilesInfoClientLayout from "@/app/(main)/resources/[resource]/files/info/[...path]/layout.client";
import { api } from "@/trpc/server";

type FilesInfoLayoutProps = {
  params: {
    resource: string;
    path?: string[];
  };
  children: React.ReactNode;
};

export default async function FilesInfoLayout({
  params: { resource, path: relativePath = [] },
  children,
}: FilesInfoLayoutProps) {
  const file = await api.files.getResourceFile({
    name: resource,
    relativePath: relativePath.map((i) => decodeURIComponent(i)),
  });

  if (!file || file.type === "dir") {
    redirect(
      `/resources/${resource}/browser/explore/${relativePath.join("/")}`,
    );
  }

  return (
    <FilesInfoClientLayout relativePath={relativePath} file={file}>
      <FilesHeader />
      <FilesTabs />
      {children}
    </FilesInfoClientLayout>
  );
}
