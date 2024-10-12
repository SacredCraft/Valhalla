"use client";

import { useEffect, useState } from "react";

import {
  DataTablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@sacred-craft/valhalla-components";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useLogsContext } from "../layout.client";
import { LogCol, logsTableColumns } from "./logs-table-columns";
import { LogsTableToolbar } from "./logs-table-toolbar";

export function LogsTable({ logs, count }: { logs: LogCol[]; count: number }) {
  const { setTable, page, setPage, perPage, setPerPage, setOrderBy } =
    useLogsContext();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: perPage,
  });

  useEffect(() => {
    for (const sort of sorting) {
      if (sort.id === "createdAt") {
        setOrderBy(sort.desc ? "desc" : "asc");
      }
    }
  }, [sorting]);

  useEffect(() => {
    setPage(pagination.pageIndex + 1);
    setPerPage(pagination.pageSize);
  }, [pagination, setPage]);

  const table = useReactTable({
    data: logs,
    columns: logsTableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: setPagination,

    manualPagination: true,
    rowCount: count,
  });

  useEffect(() => {
    setTable(table);
  }, [setTable, table]);

  return (
    <Template>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn("h-12 cursor-pointer")}
              onClick={() => {}}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={logsTableColumns.length}
              className="h-24 text-center"
            >
              No logs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Template>
  );
}

function Template({ children }: { children: React.ReactNode }) {
  const { table } = useLogsContext();

  return (
    <div className="px-2 flex flex-col gap-2">
      {table && <LogsTableToolbar />}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table &&
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
          </TableHeader>
          {children}
        </Table>
      </div>
      {table && <DataTablePagination table={table} persist name="logs" />}
    </div>
  );
}
