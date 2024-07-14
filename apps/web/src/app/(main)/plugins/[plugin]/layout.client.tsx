"use client";

import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";

import { ValhallaPlugin } from "@//server/config/types";
import { getPlugin } from "@//server/config/utils";

export type OpenedFile = {
  name: string;
  path: string[];
  tabValue?: string;
};

type ContextType = {
  plugin: ValhallaPlugin;
  openedFiles: OpenedFile[];
  setOpenedFiles: Dispatch;
};

const PluginContext = createContext<ContextType | undefined>(undefined);

export const usePluginContext = () => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error("usePluginContext must be used within a PluginProvider");
  }
  return context;
};

type PluginProps = React.PropsWithChildren;

export function PluginClientLayout({ children, pluginId }: PluginProps) {
  const [isPending, startTransition] = useTransition();
  const [plugin, setPlugin] = useState<ValhallaPlugin>();
  const [openedFiles, setOpenedFiles] = useState<OpenedFile[]>();

  useEffect(() => {
    startTransition(() => {
      setPlugin(getPlugin(pluginId));
    });
  }, [pluginId]);

  useEffect(() => {
    if (!openedFiles) {
      const cache = JSON.parse(
        localStorage.getItem(`${pluginId}-opened-files`) || "[]",
      );
      setOpenedFiles(cache);
    }
  }, [openedFiles, pluginId]);

  useEffect(() => {
    if (openedFiles) {
      localStorage.setItem(
        `${pluginId}-opened-files`,
        JSON.stringify(openedFiles),
      );
    }
  }, [openedFiles, pluginId]);

  if (isPending || !plugin) {
    return null;
  }

  if (!openedFiles) {
    return null;
  }

  return (
    <PluginContext.Provider value={{ openedFiles, setOpenedFiles, plugin }}>
      {children}
    </PluginContext.Provider>
  );
}
