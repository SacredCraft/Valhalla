import { notFound, redirect } from "next/navigation";

import { getFile } from "@//app/actions";

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
  const file = await getFile(
    pluginId,
    relativePath.map((i) => decodeURIComponent(i)).join("/"),
  );

  if (!file || file.type === "dir") {
    notFound();
  }

  redirect(`/plugins/${pluginId}/files/info/${relativePath.join("/")}`);
}
