"use client";

import { useBrowserContext } from "@/app/(main)/resources/[resource]/browser/layout.client";
import { TrashBin } from "@/app/(main)/resources/[resource]/browser/trash/_components/trash-bin";

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
