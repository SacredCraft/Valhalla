"use client";

import React, { useEffect, useMemo } from "react";

import { useBrowserContext } from "@/app/(main)/plugins/[plugin]/browser/layout.client";
import { usePluginContext } from "@/app/(main)/plugins/[plugin]/layout.client";
import { FileMeta } from "@/server/api/routers/files";
import { findFileAttributes } from "@/server/config/utils";

type ContextType = {};

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
  const { plugin } = usePluginContext();

  const realFiles = useMemo(
    () =>
      files.map((file) => {
        if (plugin?.files) {
          const attributes = findFileAttributes(
            plugin.files,
            [...relativePath, file.name],
            file.name,
          );
          return {
            ...file,
            template: attributes.template,
          };
        }
        return {
          ...file,
        };
      }),
    [files, plugin.files, relativePath],
  );

  useEffect(() => {
    setRelativePath?.(relativePath.map((i) => decodeURIComponent(i)));
  }, [relativePath, setRelativePath]);

  useEffect(() => {
    setFiles?.(realFiles);
  }, [realFiles, setFiles]);

  return <>{children}</>;
}
