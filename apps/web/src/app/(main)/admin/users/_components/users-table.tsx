"use client";

import { useEffect, useState } from "react";

import { UsersEdit } from "@/app/(main)/admin/users/_components/users-edit";
import {
  UserCol,
  usersTableColumns,
} from "@/app/(main)/admin/users/_components/users-table-columns";
import { UsersTableToolbar } from "@/app/(main)/admin/users/_components/users-table-toolbar";
import { useUsersContext } from "@/app/(main)/admin/users/layout.client";
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

export function UsersTable({ users }: { users: UserCol[] }) {
  const { setTable, data, rowSelection, setRowSelection, setData } =
    useUsersContext();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: usersTableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
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
  });

  useEffect(() => {
    setData(users);
  }, [users]);

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
                <UsersEdit key={cell.id} cell={cell} />
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={usersTableColumns.length}
              className="h-24 text-center"
            >
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Template>
  );
}

function Template({ children }: { children: React.ReactNode }) {
  const { table } = useUsersContext();

  return (
    <div className="px-2 flex flex-col gap-2">
      {table && <UsersTableToolbar />}
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
      {table && <DataTablePagination table={table} />}
    </div>
  );
}
