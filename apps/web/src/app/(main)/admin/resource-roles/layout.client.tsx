"use client";

import { Dispatch, createContext, useContext, useState } from "react";

import { useReactTable } from "@tanstack/react-table";

import { ResourceRolesHeader } from "./_components/resource-roles-header";
import { RoleCol } from "./_components/resource-roles-table-columns";
import { ResourceRolesToolbar } from "./_components/resource-roles-toolbar";

type ContextType = {
  table?: ReturnType<typeof useReactTable<RoleCol>>;
  setTable: Dispatch<ReturnType<typeof useReactTable<RoleCol>>>;
};

const ResourceRolesContext = createContext<ContextType | undefined>(undefined);

export const useResourceRolesContext = () => {
  const context = useContext(ResourceRolesContext);
  if (!context) {
    throw new Error(
      "useResourceRolesContext must be used within a ResourceRolesProvider",
    );
  }
  return context;
};

type ResourceRoleClientProps = {
  children?: React.ReactNode;
};

export function ResourceRolesClientLayout({
  children,
}: ResourceRoleClientProps) {
  const [table, setTable] =
    useState<ReturnType<typeof useReactTable<RoleCol>>>();

  return (
    <ResourceRolesContext.Provider value={{ table, setTable }}>
      <ResourceRolesHeader />
      <ResourceRolesToolbar />
      {children}
    </ResourceRolesContext.Provider>
  );
}
