import { notFound } from "next/navigation";

import { PluginFilesClient } from "@/app/[plugin]/files/[[...path]]/page.client";
import { getFilesByPath } from "@/app/actions";
import { getPluginPath } from "@/lib/cookies";
import { getDeletedFiles } from "@/lib/core";

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
  const trash = (await getDeletedFiles(pluginPath)) ?? [];

  return (
    <PluginFilesClient
      pluginPath={pluginPath}
      pluginId={pluginId}
      path={path}
      files={files}
      trash={trash}
    />
  );
}
