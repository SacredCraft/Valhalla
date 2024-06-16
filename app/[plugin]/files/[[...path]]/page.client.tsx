"use client";

import { useEffect, useState, useTransition } from "react";

import { File } from "@/app/actions";
import { Plugin } from "@/config/types";
import { getPlugin } from "@/config/utils";

import { DataTable } from "@/components/plugin/files/data-table";

type PluginFilesClientProps = {
  pluginId: string;
  files: File[];
  path: string[];
};

export function PluginFilesClient({
  pluginId,
  files,
  path,
}: PluginFilesClientProps) {
  const [plugin, setPlugin] = useState<Plugin>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setPlugin(getPlugin(pluginId));
    });
  }, [pluginId]);

  if (isPending || !plugin) {
    return <></>;
  }

  return <DataTable path={path} plugin={plugin} files={files}></DataTable>;
}
