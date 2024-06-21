"use client";

import { useBrowserContext } from "@/app/(main)/plugins/[plugin]/browser/layout.client";

import { FilesTable } from "@/components/plugin/browser/files-table";

export default function ExplorePage() {
  const { files, relativePath } = useBrowserContext();

  if (!files || !relativePath) {
    return null;
  }

  return (
    <div className="mt-2">
      <FilesTable />
    </div>
  );
}
