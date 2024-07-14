"use client";

import { motion } from "framer-motion";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";

import { useAside } from "@/app/(main)/_components/aside";
import { PluginMenu } from "@/app/(main)/plugins/[plugin]/_components/plugin-menu";
import { ValhallaPlugin } from "@/server/config/types";
import { getPlugin } from "@/server/config/utils";

export type OpenedFile = {
  name: string;
  path: string[];
  tabValue?: string;
};

type ContextType = {
  plugin: ValhallaPlugin;
  openedFiles: OpenedFile[];
  setOpenedFiles: Dispatch<SetStateAction<OpenedFile[] | undefined>>;
};

const PluginContext = createContext<ContextType | undefined>(undefined);

export const usePluginContext = () => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error("usePluginContext must be used within a PluginProvider");
  }
  return context;
};

type PluginProps = React.PropsWithChildren<{
  pluginId: string;
  ownedPluginIds: string[];
}>;

export function PluginClientLayout({
  children,
  pluginId,
  ownedPluginIds,
}: PluginProps) {
  const { collapsed } = useAside();
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
      <PluginMenu ownedPluginIds={ownedPluginIds} />
      <motion.div
        className="flex-1 ml-[calc(var(--aside-width)+220px)]"
        layout
        layoutDependency={collapsed}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </PluginContext.Provider>
  );
}
