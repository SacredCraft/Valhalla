import { getTemplateAndActions } from "@/config/plugins";
import { getPluginPath } from "@/lib/cookies";
import { getConfigurationJson } from "@/lib/core";

import { Info } from "@/components/editor/info";

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
  const pluginPath = await getPluginPath(pluginId);

  let Template: React.ElementType | undefined;
  let Actions: React.ReactNode | undefined;
  if (filePath.length === 1) {
    const res = getTemplateAndActions(pluginId, "root", filePath[0]);
    Template = res?.template;
    Actions = res?.actions;
  } else if (filePath.length > 1) {
    const res = getTemplateAndActions(
      pluginId,
      filePath[0],
      filePath[filePath.length - 1],
    );
    Template = res?.template;
    Actions = res?.actions;
  } else {
    return <div>Invalid path</div>;
  }

  if (!pluginPath) {
    return <div>Plugin not found</div>;
  }

  const initialConfiguration = await getConfigurationJson([
    pluginPath,
    ...filePath,
  ]);

  return (
    <Client
      initialConfiguration={initialConfiguration}
      pluginPath={pluginPath}
      filePath={filePath}
      info={
        <Info pluginPath={pluginPath} filePath={filePath} actions={Actions} />
      }
      template={Template ? <Template /> : <div>Template not found</div>}
    />
  );
}
