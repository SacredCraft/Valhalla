"use client";

import React, { useEffect, useMemo } from "react";

import { File } from "@/app/actions";
import { useBrowserContext } from "@/app/plugins/[plugin]/browser/layout.client";
import { usePluginContext } from "@/app/plugins/[plugin]/layout.client";
import { findFileAttributes } from "@/config/utils";

type BrowserClientLayoutProps = {
  files: File[];
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
    setRelativePath?.(relativePath);
  }, [relativePath, setRelativePath]);

  useEffect(() => {
    setFiles?.(realFiles);
  }, [realFiles, setFiles]);

  return <>{children}</>;
}
