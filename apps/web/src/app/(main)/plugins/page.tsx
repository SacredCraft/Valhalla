import { notFound, redirect } from "next/navigation";

import { api } from "@/trpc/server";

export default async function PluginsPage() {
  const ownedPluginIds = await api.resources.getOwnedResources();

  if (ownedPluginIds.length === 0) {
    return notFound();
  }

  redirect(`/plugins/${ownedPluginIds[0]}`);
}
