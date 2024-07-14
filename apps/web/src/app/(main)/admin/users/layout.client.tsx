"use client";

import { Dispatch, createContext, useContext, useState } from "react";

import { UsersHeader } from "@//components/admin/users/users-header";
import { UserCol } from "@//components/admin/users/users-table-columns";
import { UsersToolbar } from "@//components/admin/users/users-toolbar";
import { useReactTable } from "@tanstack/react-table";

type ContextType = {
  table?: ReturnType;
  setTable: Dispatch;
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
  const [table, setTable] = useState<ReturnType>();

  return (
    <UsersContext.Provider value={{ table, setTable }}>
      <UsersHeader />
      <UsersToolbar />
      {children}
    </UsersContext.Provider>
  );
}
