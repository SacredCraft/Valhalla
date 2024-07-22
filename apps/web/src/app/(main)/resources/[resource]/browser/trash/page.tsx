"use client";

import { useBrowserContext } from "@/app/(main)/resources/[resource]/browser/layout.client";

import { TrashTable } from "./_components/trash-table";

export default function TrashPage() {
  const { trash } = useBrowserContext();

  if (!trash) {
    return null;
  }

  return (
    <div className="my-2">
      <TrashTable />
    </div>
  );
}
