"use client";

import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import React, {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useReactTable } from "@tanstack/react-table";

import { LogsHeader } from "./_components/logs-header";
import { LogCol } from "./_components/logs-table-columns";
import { LogsToolbar } from "./_components/logs-toolbar";

type ContextType = {
  table?: ReturnType<typeof useReactTable<LogCol>>;
  setTable: Dispatch<ReturnType<typeof useReactTable<LogCol>>>;

  page: number;
  setPage: Dispatch<number>;

  perPage: number;
  setPerPage: Dispatch<number>;

  orderBy: "asc" | "desc";
  setOrderBy: Dispatch<"asc" | "desc">;
};

const LogsContext = createContext<ContextType | undefined>(undefined);

export const useLogsContext = () => {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error("useLogsContext must be used within a LogsProvider");
  }
  return context;
};

const sortOrder = ["asc", "desc"] as const;

export const LogsClientLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);

  useState(() => {
    setMounted(true);
  });

  if (!mounted) {
    return null;
  }

  return <Content>{children}</Content>;
};

const Content = ({ children }: { children: React.ReactNode }) => {
  const [table, setTable] =
    useState<ReturnType<typeof useReactTable<LogCol>>>();

  const localPageSize = Number(localStorage.getItem("pagination-size-logs"));

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage, setPerPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(localPageSize),
  );
  const [orderBy, setOrderBy] = useQueryState(
    "orderBy",
    parseAsStringLiteral(sortOrder).withDefault("desc"),
  );

  useEffect(() => {
    localStorage.setItem("pagination-size-logs", perPage.toString());
  }, [perPage]);

  return (
    <LogsContext.Provider
      value={{
        table,
        setTable,
        page,
        setPage,
        perPage,
        setPerPage,
        orderBy,
        setOrderBy,
      }}
    >
      <LogsHeader />
      <LogsToolbar />
      {children}
    </LogsContext.Provider>
  );
};
