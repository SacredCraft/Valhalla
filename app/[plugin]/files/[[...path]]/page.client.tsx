"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { File } from "@/app/actions";
import { Plugin } from "@/config/types";
import { findFileAttributes, getPlugin } from "@/config/utils";
import { Trash } from "@/lib/core";

import { FilesTable } from "@/components/plugin/files/files-table";

type ContextType = Omit<PluginFilesClientProps, "pluginId"> & {
  plugin: Plugin;
};

const FilesContext = createContext<ContextType | undefined>(undefined);

export const useFilesContext = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFilesContext must be used within a FilesProvider");
  }
  return context;
};

type PluginFilesClientProps = {
  pluginId: string;
  files: File[];
  path: string[];
  trash: Trash[];
  pluginPath: string;
};

export function PluginFilesClient({
  pluginId,
  files,
  path,
  trash,
  pluginPath,
}: PluginFilesClientProps) {
  const [plugin, setPlugin] = useState<Plugin>();
  const [isPending, startTransition] = useTransition();

  const realFiles = useMemo(() => {
    return files.map((file) => {
      if (plugin?.files) {
        const attributes = findFileAttributes(
          plugin.files,
          [...path, file.name],
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
    });
  }, [files, path, plugin?.files]);

  useEffect(() => {
    startTransition(() => {
      setPlugin(getPlugin(pluginId));
    });
  }, [pluginId]);

  if (isPending || !plugin) {
    return <></>;
  }

  return (
    <FilesContext.Provider
      value={{ plugin, files: realFiles, path, trash, pluginPath }}
    >
      <FilesTable />
    </FilesContext.Provider>
  );
}
