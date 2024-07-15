import { notFound, redirect } from "next/navigation";

import { api } from "@/trpc/server";

type BrowserProps = {
  params: {
    plugin: string;
    path?: string[];
  };
};

export default async function Browser({
  params: { plugin: pluginId, path: relativePath },
}: BrowserProps) {
  if (!relativePath) {
    redirect(`/plugins/${pluginId}/browser/explore`);
  }
  const file = await api.files.getPluginFile({
    id: pluginId,
    relativePath: relativePath.map((i) => decodeURIComponent(i)),
  });

  if (!file || file.type === "dir") {
    notFound();
  }

  redirect(`/plugins/${pluginId}/files/info/${relativePath.join("/")}`);
}
