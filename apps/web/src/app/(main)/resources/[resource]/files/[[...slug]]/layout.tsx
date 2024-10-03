import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { api } from "@/trpc/server";

import { ResourceProvider } from "./layout.client";

type LayoutProps = {
  children: ReactNode;
  params: Param;
};

type Param = {
  resource: string;
};

export default async function Layout({
  children,
  params: { resource },
}: LayoutProps) {
  const ownedResources = await api.resources.getOwnedResources();

  if (!ownedResources.includes(resource)) {
    return notFound();
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      <ResourceProvider resource={resource} ownedResources={ownedResources}>
        {children}
      </ResourceProvider>
    </div>
  );
}
