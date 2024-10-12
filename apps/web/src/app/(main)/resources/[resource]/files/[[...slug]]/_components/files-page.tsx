"use client";

import { api } from "@/trpc/react";

import { BrowserPage } from "./browser/browser-page";
import { FilePage } from "./file/file-page";

export function FilesPage({
  params: { slug = [], resource },
}: {
  params: { slug?: string[]; resource: string };
}) {
  const path = slug.map(decodeURIComponent);

  const { data: fileType } = api.files.getFileType.useQuery({
    resource,
    relativePath: path,
  });

  if (!fileType) {
    return null;
  }

  if (fileType === "dir") {
    return <BrowserPage />;
  }

  return <FilePage relativePath={path} />;
}
