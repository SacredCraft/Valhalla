import { notFound } from "next/navigation";

import { PluginClientLayout } from "@/app/(main)/plugins/[plugin]/layout.client";
import { getOwnedResources } from "@/server/service/resource";

type PluginProps = {
  params: {
    plugin: string;
  };
  children: React.ReactNode;
};

export default async function PluginLayout({
  children,
  params: { plugin: pluginId },
}: PluginProps) {
  const ownedPluginIds = await getOwnedResources();
  if (!ownedPluginIds.includes(pluginId)) {
    return notFound();
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      <PluginClientLayout pluginId={pluginId} ownedPluginIds={ownedPluginIds}>
        {children}
      </PluginClientLayout>
    </div>
  );
}
