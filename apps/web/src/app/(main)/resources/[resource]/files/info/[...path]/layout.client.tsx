"use client";

import { createContext, useContext, useEffect } from "react";

import { useFilesContext } from "@/app/(main)/resources/[resource]/files/layout.client";
import { FileMeta } from "@/server/api/routers/files";

type ContextType = {
  file: FileMeta;
};

const FilesInfoContext = createContext<ContextType | undefined>(undefined);

export const useFilesInfoContext = () => {
  const context = useContext(FilesInfoContext);
  if (!context) {
    throw new Error(
      "useFilesInfoContext must be used within an FilesInfoProvider",
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

export default function FilesInfoClientLayout({
  file,
  children,
  relativePath,
}: FilesInfoClientLayoutProps) {
  const { setRelativePath } = useFilesContext();

  useEffect(() => {
    setRelativePath?.(relativePath.map((i) => decodeURIComponent(i)));
  }, [relativePath, setRelativePath]);

  return (
    <FilesInfoContext.Provider
      value={{
        file,
      }}
    >
      {children}
    </FilesInfoContext.Provider>
  );
}
