"use client";

import React, {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { FileMeta } from "@/server/api/routers/files";
import valhallaConfig from "@/valhalla";
import { getTemplateByPath } from "@sacred-craft/valhalla-resource";
import {
  ColumnFiltersState,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";

import { useBrowserContext } from "../../layout.client";
import { FileCol } from "./_components/files-table-columns";

type ContextType = {
  relativePath: string[];

  table?: ReturnType<typeof useReactTable<FileCol>>;
  setTable: Dispatch<ReturnType<typeof useReactTable<FileCol>>>;

  files: FileMeta[];

  data: FileCol[];
  setData: Dispatch<FileCol[]>;

  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;

  columnVisibility: VisibilityState;
  setColumnVisibility: OnChangeFn<VisibilityState>;

  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;

  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
};

const ExploreContext = createContext<ContextType | undefined>(undefined);

export const useExploreContext = () => {
  const context = useContext(ExploreContext);
  if (!context) {
    throw new Error("useExploreContext must be used within a ExploreProvider");
  }
  return context;
};

type ExploreClientLayoutProps = {
  files: FileMeta[];
  children?: React.ReactNode;
  relativePath: string[];
};

export function ExploreClientLayout({
  files,
  children,
  relativePath,
}: ExploreClientLayoutProps) {
  const { setRelativePath } = useBrowserContext();
  const [table, setTable] =
    useState<ReturnType<typeof useReactTable<FileCol>>>();

  const [data, setData] = useState<FileCol[]>(files);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { resource } = useResourceContext();

  useEffect(() => {
    setRelativePath?.(relativePath.map((i) => decodeURIComponent(i)));
  }, [relativePath]);

  const realFiles = useMemo(
    () =>
      files.map((file) => {
        const template = getTemplateByPath(file.path, resource, valhallaConfig);
        return {
          ...file,
          template,
        };
      }),
    [files, relativePath],
  );

  return (
    <ExploreContext.Provider
      value={{
        table,
        setTable,
        files: realFiles,
        relativePath: relativePath.map((i) => decodeURIComponent(i)),
        data,
        setData,
        rowSelection,
        setRowSelection,
        columnVisibility,
        setColumnVisibility,
        columnFilters,
        setColumnFilters,
        sorting,
        setSorting,
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
}
