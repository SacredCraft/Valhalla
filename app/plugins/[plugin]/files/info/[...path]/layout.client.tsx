"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { ValhallaFile } from "@/app/actions";
import { useFilesContext } from "@/app/plugins/[plugin]/files/layout.client";

type ContextType = {
  file: ValhallaFile;
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
  file: ValhallaFile;
  children?: React.ReactNode;
  relativePath: string[];
};

export default function FilesInfoClientLayout({
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
    <FilesInfoContext.Provider
      value={{
        file,
      }}
    >
      {children}
    </FilesInfoContext.Provider>
  );
}
