"use client";

import { FilesTable } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/files-table";
import { useBrowserContext } from "@/app/(main)/resources/[resource]/browser/layout.client";

export default function ExplorePage() {
  const { files, relativePath } = useBrowserContext();

  if (!files || !relativePath) {
    return null;
  }

  return (
    <div className="my-2">
      <FilesTable />
    </div>
  );
}
