import { PluginPathForm } from "@/app/(main)/admin/plugin-path/_components/plugin-path-form";
import { PluginPathHeader } from "@/app/(main)/admin/plugin-path/_components/plugin-path-header";
import { getAllPluginPaths } from "@/app/actions";

export default async function PluginPath() {
  const pluginPaths = await getAllPluginPaths();

  return (
    <>
      <PluginPathHeader />
      <PluginPathForm pluginPaths={pluginPaths} />
    </>
  );
}
