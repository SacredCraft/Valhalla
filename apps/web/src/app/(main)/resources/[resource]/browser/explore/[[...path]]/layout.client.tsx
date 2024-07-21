"use client";

import React, { useEffect, useMemo } from "react";

import { useBrowserContext } from "@/app/(main)/resources/[resource]/browser/layout.client";
import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { FileMeta } from "@/server/api/routers/files";
import valhallaConfig from "@/valhalla";
import { getTemplateByPath } from "@sacred-craft/resource";

type BrowserClientLayoutProps = {
  files: FileMeta[];
  children?: React.ReactNode;
  relativePath: string[];
};

export function ExploreClientLayout({
  files,
  children,
  relativePath,
}: BrowserClientLayoutProps) {
  const { setFiles, setRelativePath } = useBrowserContext();
  const { resource } = useResourceContext();

  const realFiles = useMemo(
    () =>
      files.map((file) => {
        const template = getTemplateByPath(file.path, resource, valhallaConfig);
        return {
          ...file,
          template,
        };
      }),
    [files, relativePath],
  );

  useEffect(() => {
    setRelativePath?.(relativePath.map((i) => decodeURIComponent(i)));
  }, [relativePath, setRelativePath]);

  useEffect(() => {
    setFiles?.(realFiles);
  }, [realFiles, setFiles]);

  return <>{children}</>;
}
