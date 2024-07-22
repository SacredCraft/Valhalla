"use client";

import { TrashTable } from "./_components/trash-table";
import { useTrashContext } from "./layout.client";

export default function TrashPage() {
  const { trash } = useTrashContext();

  if (!trash) {
    return null;
  }

  return (
    <div className="my-2">
      <TrashTable />
    </div>
  );
}
