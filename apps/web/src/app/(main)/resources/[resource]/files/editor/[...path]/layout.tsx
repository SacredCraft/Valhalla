import { notFound, redirect } from "next/navigation";
import React from "react";

import { ActionSave } from "@/app/(main)/resources/[resource]/files/_components/action-save";
import { FilesHeader } from "@/app/(main)/resources/[resource]/files/_components/files-header";
import { FilesTabs } from "@/app/(main)/resources/[resource]/files/_components/files-tabs";
import FilesEditorClientLayout from "@/app/(main)/resources/[resource]/files/editor/[...path]/layout.client";
import { ConfigurationResult, getConfigurationJson } from "@/lib/core";
import { api } from "@/trpc/server";

type FilesEditorLayoutProps = {
  params: {
    resource: string;
    path?: string[];
  };
  children: React.ReactNode;
};

export default async function FilesInfoLayout({
  params: { resource, path: relativePath = [] },
  children,
}: FilesEditorLayoutProps) {
  const file = await api.files.getResourceFile({
    resource,
    relativePath: relativePath.map((i) => decodeURIComponent(i)),
  });

  let initialConfiguration: ConfigurationResult | null;

  try {
    initialConfiguration = await getConfigurationJson(
      resource,
      relativePath.map((i) => decodeURIComponent(i)),
    );
  } catch (e) {
    redirect(
      `/resources/${resource}/browser/explore/${relativePath.join("/")}`,
    );
  }

  if (!file || !initialConfiguration) {
    return notFound();
  }

  return (
    <FilesEditorClientLayout
      relativePath={relativePath}
      file={file}
      configuration={initialConfiguration}
    >
      <FilesHeader />
      <FilesTabs right={<ActionSave />} />
      {children}
    </FilesEditorClientLayout>
  );
}
