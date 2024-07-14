"use client";

import React, { Dispatch, createContext, useContext } from "react";

type ContextType = {
  relativePath: string[];
  setRelativePath: Dispatch;
};

const FilesContext = createContext<ContextType | undefined>(undefined);

export const useFilesContext = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFilesContext must be used within a FilesProvider");
  }
  return context;
};

type FilesClientLayoutProps = {
  pluginId: string;
  children?: React.ReactNode;
};

export function FilesClientLayout({ children }: FilesClientLayoutProps) {
  const [relativePath, setRelativePath] = React.useState<string[]>([]);

  return (
    <FilesContext.Provider
      value={{
        relativePath,
        setRelativePath,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
}
