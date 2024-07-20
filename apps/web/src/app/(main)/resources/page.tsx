import { notFound, redirect } from "next/navigation";

import { api } from "@/trpc/server";

export default async function ResourcesPage() {
  const ownedResources = await api.resources.getOwnedResources();

  if (ownedResources.length === 0) {
    return notFound();
  }

  redirect(`/resources/${ownedResources[0]}`);
}
