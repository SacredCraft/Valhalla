import { notFound, redirect } from "next/navigation";

import { api } from "@/trpc/server";

type BrowserProps = {
  params: {
    resource: string;
    path?: string[];
  };
};

export default async function Browser({
  params: { resource, path: relativePath },
}: BrowserProps) {
  if (!relativePath) {
    redirect(`/resources/${resource}/browser/explore`);
  }
  const file = await api.files.getResourceFile({
    name: resource,
    relativePath: relativePath.map((i) => decodeURIComponent(i)),
  });

  if (!file || file.type === "dir") {
    notFound();
  }

  redirect(`/resources/${resource}/files/info/${relativePath.join("/")}`);
}
