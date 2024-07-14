import { notFound, redirect } from "next/navigation";
import React from "react";

import { ActionSave } from "@/app/(main)/plugins/[plugin]/files/_components/action-save";
import { FilesHeader } from "@/app/(main)/plugins/[plugin]/files/_components/files-header";
import { FilesTabs } from "@/app/(main)/plugins/[plugin]/files/_components/files-tabs";
import FilesEditorClientLayout from "@/app/(main)/plugins/[plugin]/files/editor/[...path]/layout.client";
import { getFile } from "@/app/actions";
import { ConfigurationResult, getConfigurationJson } from "@/lib/core";

type FilesEditorLayoutProps = {
  params: {
    plugin: string;
    path?: string[];
  };
  children: React.ReactNode;
};

export default async function FilesInfoLayout({
  params: { plugin: pluginId, path: relativePath = [] },
  children,
}: FilesEditorLayoutProps) {
  const file = await getFile(
    pluginId,
    relativePath.map((i) => decodeURIComponent(i)).join("/"),
  );

  let initialConfiguration: ConfigurationResult | null;

  try {
    initialConfiguration = await getConfigurationJson(
      pluginId,
      relativePath.map((i) => decodeURIComponent(i)),
    );
  } catch (e) {
    redirect(`/plugins/${pluginId}/browser/explore/${relativePath.join("/")}`);
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
