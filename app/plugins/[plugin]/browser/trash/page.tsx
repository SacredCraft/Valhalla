"use client";

import { useBrowserContext } from "@/app/plugins/[plugin]/browser/layout.client";

import { TrashBin } from "@/components/plugin/browser/trash-bin";

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
