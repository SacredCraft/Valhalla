import { getAllPluginPaths } from "@//app/actions";
import { PluginPathForm } from "@//components/admin/plugin-path/plugin-path-form";
import { PluginPathHeader } from "@//components/admin/plugin-path/plugin-path-header";

export default async function PluginPath() {
  const pluginPaths = await getAllPluginPaths();

  return (
    <>
      <PluginPathHeader />
      <PluginPathForm pluginPaths={pluginPaths} />
    </>
  );
}
