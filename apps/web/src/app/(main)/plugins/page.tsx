import { notFound, redirect } from "next/navigation";

import { getOwnedResources } from "@/server/service/resource";

export default async function PluginsPage() {
  const ownedPluginIds = await getOwnedResources();

  if (ownedPluginIds.length === 0) {
    return notFound();
  }

  redirect(`/plugins/${ownedPluginIds[0]}`);
}
