"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { File } from "@/app/actions";
import { useFilesContext } from "@/app/plugins/[plugin]/files/layout.client";

type ContextType = {
  file: File;
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
  file: File;
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
    setRelativePath?.(relativePath);
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
