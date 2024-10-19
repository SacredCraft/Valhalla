"use client";

import React, { Dispatch, createContext, useContext, useState } from "react";

import { Trash } from "@/server/api/routers/files";
import {
  ColumnFiltersState,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";

import { DeleteAll } from "./_components/delete-all";
import { RestoreAll } from "./_components/restore-all";
import { TrashHeader } from "./_components/trash-header";
import { TrashTabs } from "./_components/trash-tabs";

type ContextType = {
  table?: ReturnType<typeof useReactTable<Trash>>;
  setTable: Dispatch<ReturnType<typeof useReactTable<Trash>>>;

  trash: Trash[];

  data: Trash[];
  setData: Dispatch<Trash[]>;

  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;

  columnVisibility: VisibilityState;
  setColumnVisibility: OnChangeFn<VisibilityState>;

  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;

  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
};

const TrashContext = createContext<ContextType | undefined>(undefined);

export const useTrashContext = () => {
  const context = useContext(TrashContext);
  if (!context) {
    throw new Error("useTrashContext must be used within a TrashProvider");
  }
  return context;
};

type TrashClientLayoutProps = {
  trash: Trash[];
  children?: React.ReactNode;
};

export function TrashClientLayout({ trash, children }: TrashClientLayoutProps) {
  const [table, setTable] = useState<ReturnType<typeof useReactTable<Trash>>>();

  const [data, setData] = useState<Trash[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <TrashContext.Provider
      value={{
        table,
        setTable,
        trash,
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
      <TrashHeader />
      <TrashTabs
        left={<></>}
        right={
          <>
            <RestoreAll />
            <DeleteAll />
          </>
        }
      />
      {children}
    </TrashContext.Provider>
  );
}
