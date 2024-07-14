"use client";

import { useBrowserContext } from "@/app/(main)/plugins/[plugin]/browser/layout.client";
import { TrashBin } from "@/app/(main)/plugins/[plugin]/browser/trash/_components/trash-bin";

export default function TrashPage() {
  const { trash } = useBrowserContext();

  if (!trash) {
    return null;
  }

  return (
    <div className="mt-2">
      <TrashBin />
    </div>
  );
}
