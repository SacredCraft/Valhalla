import { notFound, redirect } from "next/navigation";

import { getOwnedResources } from "@/service/resource";

export default async function PluginsPage() {
  const ownedPluginIds = await getOwnedResources();

  if (ownedPluginIds.length === 0) {
    return notFound();
  }

  redirect(`/plugins/${ownedPluginIds[0]}`);
}
