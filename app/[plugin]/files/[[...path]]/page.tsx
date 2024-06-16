import { notFound } from "next/navigation";

import { PluginFilesClient } from "@/app/[plugin]/files/[[...path]]/page.client";
import { getFilesByPath } from "@/app/actions";
import { getPlugin } from "@/config/utils";
import { getPluginPath } from "@/lib/cookies";

type PluginFilesProps = {
  params: {
    plugin: string;
    path?: string[];
  };
};

export default async function PluginFiles({
  params: { plugin: pluginId, path = [] },
}: PluginFilesProps) {
  const pluginPath = await getPluginPath(pluginId);

  if (!pluginPath) {
    return notFound();
  }

  const files = (await getFilesByPath([pluginPath, ...path])) ?? [];

  return <PluginFilesClient pluginId={pluginId} path={path} files={files} />;
}
