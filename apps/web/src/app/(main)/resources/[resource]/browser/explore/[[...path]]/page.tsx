"use client";

import { FilesTable } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/files-table";

import { useExploreContext } from "./layout.client";

export default function ExplorePage() {
  const { relativePath, files } = useExploreContext();

  if (!files || !relativePath) {
    return null;
  }

  return (
    <div className="my-2">
      <FilesTable />
    </div>
  );
}
