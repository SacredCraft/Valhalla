"use client";

import React, {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type OpenedFile = {
  name: string;
  path: string[];
};

type ContextType = {
  openedFiles: OpenedFile[];
  setOpenedFiles: Dispatch<OpenedFile[]>;
};

const PluginContext = createContext<ContextType | undefined>(undefined);

export const usePluginContext = () => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error("usePluginContext must be used within a PluginProvider");
  }
  return context;
};

type ContentProps = React.PropsWithChildren<{
  pluginId: string;
}>;

export function PluginClientLayout({ children, pluginId }: ContentProps) {
  const [openedFiles, setOpenedFiles] = useState<OpenedFile[]>([
    {
      name: "def.yml",
      path: ["item", "def.yml"],
    },
    {
      name: "def.yml",
      path: ["display", "def.yml"],
    },
    {
      name: "config.yml",
      path: [],
    },
  ]);

  useEffect(() => {
    const cache = JSON.parse(
      localStorage.getItem(`${pluginId}-opened-files`) || "[]",
    );
    setOpenedFiles(cache);
  }, [pluginId]);

  useEffect(() => {
    localStorage.setItem(
      `${pluginId}-opened-files`,
      JSON.stringify(openedFiles),
    );
  }, [openedFiles, pluginId]);

  return (
    <PluginContext.Provider value={{ openedFiles, setOpenedFiles }}>
      {children}
    </PluginContext.Provider>
  );
}
