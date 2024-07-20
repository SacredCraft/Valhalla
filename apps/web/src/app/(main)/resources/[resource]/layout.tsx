import { notFound } from "next/navigation";

import { ResourceClientLayout } from "@/app/(main)/resources/[resource]/layout.client";
import { api } from "@/trpc/server";

type ResourceProps = {
  params: {
    resource: string;
  };
  children: React.ReactNode;
};

export default async function ResourceLayout({
  children,
  params: { resource: resourceId },
}: ResourceProps) {
  const ownedResources = await api.resources.getOwnedResources();
  if (!ownedResources.includes(resourceId)) {
    return notFound();
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      <ResourceClientLayout
        resourceName={resourceId}
        ownedResources={ownedResources}
      >
        {children}
      </ResourceClientLayout>
    </div>
  );
}
