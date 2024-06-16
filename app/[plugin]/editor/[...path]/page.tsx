import { notFound, redirect } from "next/navigation";

import { findFileAttributes, getPlugin } from "@/config/utils";
import { getPluginPath } from "@/lib/cookies";
import { ConfigurationResult, getConfigurationJson } from "@/lib/core";

import { Info } from "@/components/plugin/editor/info";

import Client from "./page.client";

type Props = {
  params: {
    plugin: string;
    path: string[];
  };
};

export default async function Editor({
  params: { plugin: pluginId, path: filePath },
}: Props) {
  const plugin = getPlugin(pluginId);
  const pluginPath = await getPluginPath(pluginId);

  if (!plugin || !pluginPath) {
    return notFound();
  }

  let Template: React.ElementType | undefined;
  let Actions: React.ReactNode | undefined;

  const attributes = findFileAttributes(
    plugin.files,
    filePath,
    filePath[filePath.length - 1],
  );

  if (attributes) {
    Template = attributes.template?.value;
    Actions = attributes.actions;
  }

  let initialConfiguration: ConfigurationResult;

  try {
    initialConfiguration = await getConfigurationJson(
      [pluginPath, ...filePath].map((i) => decodeURIComponent(i)),
    );
  } catch (e) {
    redirect(`/${pluginId}/files/${filePath.join("/")}`);
  }

  return (
    <Client
      relations={[]}
      initialConfiguration={initialConfiguration}
      pluginPath={pluginPath}
      filePath={filePath}
      pluginId={pluginId}
      info={<Info actions={Actions} />}
      template={Template ? <Template /> : <div>Template not found</div>}
    />
  );
}
