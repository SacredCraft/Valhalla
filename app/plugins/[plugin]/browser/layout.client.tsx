"use client";

import React, {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";

import { File } from "@/app/actions";
import { Plugin } from "@/config/types";
import { getPlugin } from "@/config/utils";
import { Trash } from "@/lib/core";
import { useReactTable } from "@tanstack/react-table";

import { FileCol } from "@/components/plugin/browser/files-table-columns";

type ContextType = Omit<BrowserClientLayoutProps, "pluginId"> & {
  plugin: Plugin;
  relativePath?: string[];
  files?: FileCol[];
  trash?: Trash[];
  table?: ReturnType<typeof useReactTable<FileCol>>;
  setTable?: Dispatch<ReturnType<typeof useReactTable<FileCol>>>;
  setFiles?: Dispatch<File[]>;
  setTrash?: Dispatch<Trash[]>;
  setRelativePath?: Dispatch<string[] | undefined>;
};

const BrowserContext = createContext<ContextType | undefined>(undefined);

export const useBrowserContext = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error("useBrowserContext must be used within a BrowserProvider");
  }
  return context;
};

type BrowserClientLayoutProps = {
  pluginId: string;
  children?: React.ReactNode;
};

export function BrowserClientLayout({
  pluginId,
  children,
}: BrowserClientLayoutProps) {
  const [plugin, setPlugin] = useState<Plugin>();
  const [table, setTable] =
    useState<ReturnType<typeof useReactTable<FileCol>>>();
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<FileCol[]>();
  const [trash, setTrash] = useState<Trash[]>();
  const [relativePath, setRelativePath] = useState<string[]>();

  useEffect(() => {
    startTransition(() => {
      setPlugin(getPlugin(pluginId));
    });
  }, [pluginId]);

  if (isPending || !plugin) {
    return null;
  }

  return (
    <BrowserContext.Provider
      value={{
        plugin,
        relativePath,
        files,
        trash,
        table,
        setTable,
        setFiles,
        setTrash,
        setRelativePath,
      }}
    >
      {children}
    </BrowserContext.Provider>
  );
}
