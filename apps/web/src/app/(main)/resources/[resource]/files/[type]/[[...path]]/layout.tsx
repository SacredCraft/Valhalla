import { redirect } from "next/navigation";

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

  return <FileClientLayout type={type} relativePath={relativePath} />;
}
