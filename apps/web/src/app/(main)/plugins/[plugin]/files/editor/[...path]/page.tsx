"use client";

import { useFilesContext } from "@/app/(main)/plugins/[plugin]/files/layout.client";
import { usePluginContext } from "@/app/(main)/plugins/[plugin]/layout.client";
import { findFileAttributes } from "@/server/config/utils";

export default function EditorPage() {
  const { plugin } = usePluginContext();
  const { relativePath } = useFilesContext();
  const attributes = findFileAttributes(
    plugin.files,
    relativePath,
    relativePath[relativePath.length - 1],
  );

  let Template: React.ElementType | undefined;
  let Actions: React.ReactNode | undefined;

  if (attributes) {
    Template = attributes.template?.value;
    Actions = attributes.actions;
  }

  return <>{Template && <Template />}</>;
}
