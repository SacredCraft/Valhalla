"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useFilesContext } from "@/app/(main)/plugins/[plugin]/files/layout.client";
import { FileMeta } from "@/server/api/routers/files";

type ContextType = {
  file: FileMeta;
};

const FilesRawContext = createContext<ContextType | undefined>(undefined);

export const useFilesRawContext = () => {
  const context = useContext(FilesRawContext);
  if (!context) {
    throw new Error(
      "useFilesRawContext must be used within an FilesRawProvider",
    );
  }
  return context;
};

type FilesInfoClientLayoutProps = {
  template?: React.ReactNode;
  file: FileMeta;
  children?: React.ReactNode;
  relativePath: string[];
};

export default function FilesRawClientLayout({
  template,
  file,
  children,
  relativePath,
}: FilesInfoClientLayoutProps) {
  const { setRelativePath } = useFilesContext();
  const [tabValue, setTabValue] = useState(template ? "edit" : "raw");

  useEffect(() => {
    setRelativePath?.(relativePath.map((i) => decodeURIComponent(i)));
  }, [relativePath, setRelativePath]);

  return (
    <FilesRawContext.Provider
      value={{
        file,
      }}
    >
      {children}
    </FilesRawContext.Provider>
  );
}
