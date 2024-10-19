import { notFound } from "next/navigation";

import { api } from "@/trpc/server";

import { ResourceProvider } from "../files/[[...slug]]/layout.client";
import { TrashClientLayout } from "./layout.client";

type TrashLayoutProps = {
  params: {
    resource: string;
  };
  children: React.ReactNode;
};

export default async function TrashLayout({
  params: { resource },
  children,
}: TrashLayoutProps) {
  const ownedResources = await api.resources.getOwnedResources();
  const trash = await api.files.getTrash({ resource });

  if (!ownedResources.includes(resource)) {
    return notFound();
  }

  return (
    <ResourceProvider resource={resource} ownedResources={ownedResources}>
      <TrashClientLayout trash={trash}>{children}</TrashClientLayout>
    </ResourceProvider>
  );
}
