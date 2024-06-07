"use server";

import { cookies } from "next/headers";

type PluginPath = {
  pluginId: string;
  path: string;
};

export async function getPluginPath(id: string) {
  return JSON.parse(cookies().get("pluginPaths")?.value || "[]").find(
    (path: PluginPath) => path.pluginId === id,
  )?.path as string | undefined;
}

export async function setPluginPath(id: string, path: string) {
  const pluginPaths = JSON.parse(cookies().get("pluginPaths")?.value || "[]");
  const index = pluginPaths.findIndex(
    (path: PluginPath) => path.pluginId === id,
  );
  if (index !== -1) {
    pluginPaths[index].path = path;
  } else {
    pluginPaths.push({ pluginId: id, path });
  }
  cookies().set("pluginPaths", JSON.stringify(pluginPaths));
}
