import React from "react";

import { FilesClientLayout } from "@/app/plugins/[plugin]/files/layout.client";

type FilesLayoutProps = {
  params: {
    plugin: string;
  };
  children: React.ReactNode;
};

export default async function FilesLayout({
  params: { plugin: pluginId },
  children,
}: FilesLayoutProps) {
  return <FilesClientLayout pluginId={pluginId}>{children}</FilesClientLayout>;
}
