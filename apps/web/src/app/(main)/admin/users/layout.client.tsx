"use client";

import { Dispatch, createContext, useContext, useState } from "react";

import { UsersHeader } from "@/app/(main)/admin/users/_components/users-header";
import { UserCol } from "@/app/(main)/admin/users/_components/users-table-columns";
import { UsersToolbar } from "@/app/(main)/admin/users/_components/users-toolbar";
import {
  OnChangeFn,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";

type ContextType = {
  table?: ReturnType<typeof useReactTable<UserCol>>;
  setTable: Dispatch<ReturnType<typeof useReactTable<UserCol>>>;

  data: UserCol[];
  setData: Dispatch<UserCol[]>;

  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;

  refresh?: () => void;
  setRefresh: Dispatch<() => void>;
};

const UsersContext = createContext<ContextType | undefined>(undefined);

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsersContext must be used within a UsersProvider");
  }
  return context;
};

type UsersClientLayoutProps = {
  children?: React.ReactNode;
};

export function UsersClientLayout({ children }: UsersClientLayoutProps) {
  const [table, setTable] =
    useState<ReturnType<typeof useReactTable<UserCol>>>();
  const [data, setData] = useState<UserCol[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [refresh, setRefresh] = useState<() => void>();

  return (
    <UsersContext.Provider
      value={{
        table,
        setTable,
        data,
        setData,
        rowSelection,
        setRowSelection,
        refresh,
        setRefresh,
      }}
    >
      <UsersHeader />
      <UsersToolbar />
      {children}
    </UsersContext.Provider>
  );
}
