import { notFound, redirect } from "next/navigation";

import { api } from "@/trpc/server";

import { FileClientLayout } from "./layout.client";

type FileLayoutProps = {
  params: {
    resource: string;
    type: string;
    path?: string[];
  };
};

export default async function FileLayout({
  params: { resource, type, path: relativePath },
}: FileLayoutProps) {
  if (!relativePath) {
    redirect(`/resources/${resource}/browser/explore`);
  }

  const meta = await api.files.getResourceFile({
    resource,
    relativePath: relativePath.map((i) => decodeURIComponent(i)),
  });

  if (!meta || meta.type === "dir") {
    notFound();
  }

  return (
    <FileClientLayout type={type} relativePath={relativePath} meta={meta} />
  );
}
