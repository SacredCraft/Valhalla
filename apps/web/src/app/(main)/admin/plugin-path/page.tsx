import { PluginPathForm } from "@/app/(main)/admin/plugin-path/_components/plugin-path-form";
import { PluginPathHeader } from "@/app/(main)/admin/plugin-path/_components/plugin-path-header";
import { api } from "@/trpc/server";

export default async function PluginPath() {
  const pluginPaths = await api.pluginPaths.getPluginPaths();

  return (
    <>
      <PluginPathHeader />
      <PluginPathForm pluginPaths={pluginPaths} />
    </>
  );
}
