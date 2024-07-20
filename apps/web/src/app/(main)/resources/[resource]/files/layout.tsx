import React from "react";

import { FilesClientLayout } from "@/app/(main)/resources/[resource]/files/layout.client";

type FilesLayoutProps = {
  children: React.ReactNode;
};

export default async function FilesLayout({ children }: FilesLayoutProps) {
  return <FilesClientLayout>{children}</FilesClientLayout>;
}
