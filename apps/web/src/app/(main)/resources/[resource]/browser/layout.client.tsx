"use client";

import React, { Dispatch, createContext, useContext, useState } from "react";

import { FileCol } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/files-table-columns";
import { Trash } from "@/lib/core";
import { FileMeta } from "@/server/api/routers/files";
import { useReactTable } from "@tanstack/react-table";

type ContextType = {
  relativePath?: string[];
  files?: FileCol[];
  copyFiles?: string[];
  cutFiles?: string[];
  trash?: Trash[];
  table?: ReturnType<typeof useReactTable<FileCol>>;
  setTable?: Dispatch<ReturnType<typeof useReactTable<FileCol>>>;
  setFiles?: Dispatch<FileMeta[]>;
  setTrash?: Dispatch<Trash[]>;
  setRelativePath?: Dispatch<string[] | undefined>;
  setCopyFiles?: Dispatch<string[] | undefined>;
  setCutFiles?: Dispatch<string[] | undefined>;
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
  children?: React.ReactNode;
};

export function BrowserClientLayout({ children }: BrowserClientLayoutProps) {
  const [table, setTable] =
    useState<ReturnType<typeof useReactTable<FileCol>>>();
  const [files, setFiles] = useState<FileCol[]>();
  const [copyFiles, setCopyFiles] = useState<string[]>();
  const [cutFiles, setCutFiles] = useState<string[]>();
  const [trash, setTrash] = useState<Trash[]>();
  const [relativePath, setRelativePath] = useState<string[]>();

  return (
    <BrowserContext.Provider
      value={{
        relativePath,
        files,
        copyFiles,
        cutFiles,
        trash,
        table,
        setTable,
        setFiles,
        setTrash,
        setRelativePath,
        setCopyFiles,
        setCutFiles,
      }}
    >
      {children}
    </BrowserContext.Provider>
  );
}
