import { notFound } from "next/navigation";

import { PluginClientLayout } from "@/app/(main)/plugins/[plugin]/layout.client";
import { getOwnedResources } from "@/server/service/resource";

import { PluginMenu } from "@/components/plugin/plugin-menu";

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
      <PluginClientLayout pluginId={pluginId}>
        <PluginMenu ownedPluginIds={ownedPluginIds} />
        <div className="flex-1">{children}</div>
      </PluginClientLayout>
    </div>
  );
}
