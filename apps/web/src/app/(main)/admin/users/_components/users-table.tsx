"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UsersEdit } from "@/app/(main)/admin/users/_components/users-edit";
import {
  UserCol,
  usersTableColumns,
} from "@/app/(main)/admin/users/_components/users-table-columns";
import { UsersTableToolbar } from "@/app/(main)/admin/users/_components/users-table-toolbar";
import { useUsersContext } from "@/app/(main)/admin/users/layout.client";
import { DataTablePagination } from "@/app/_components/ui/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { cn } from "@/lib/utils";
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
  const { setTable } = useUsersContext();
  const [data, setData] = useState<UserCol[]>(users);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const router = useRouter();

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
    meta: {
      setData,
      refresh: () => router.refresh(),
    },
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
              No files found.
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
      <div className="border rounded-lg">
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
