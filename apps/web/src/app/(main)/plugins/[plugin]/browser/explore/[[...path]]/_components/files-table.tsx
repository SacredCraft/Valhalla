"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FilesTableToolbar } from "@/app/(main)/plugins/[plugin]/browser/explore/[[...path]]/_components/files-table-toolbar";
import { useBrowserContext } from "@/app/(main)/plugins/[plugin]/browser/layout.client";
import { usePluginContext } from "@/app/(main)/plugins/[plugin]/layout.client";
import { DataTablePagination } from "@/app/_components/ui/data-table-pagination";
import { ImageModel } from "@/app/_components/ui/image-model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { revalidate } from "@/app/actions";
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

import { FileCol, filesTableColumns } from "./files-table-columns";

export function FilesTable() {
  const { plugin, setOpenedFiles, openedFiles } = usePluginContext();
  const { relativePath, files, setTable } = useBrowserContext();

  if (!relativePath || !files) {
    throw new Error("relativePath and files are required");
  }

  const [data, setData] = useState<FileCol[]>(files);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const router = useRouter();
  const pathname = usePathname();

  const table = useReactTable({
    data,
    columns: filesTableColumns,
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
      refresh: () => revalidate(pathname),
    },
  });

  useEffect(() => {
    setData(files);
  }, [files]);

  useEffect(() => {
    setTable?.(table);
  }, [setTable, table]);

  return (
    <Template>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const isImage = row.original.template?.name === "Image";
            return isImage ? (
              <ImageModel key={row.id} src={row.original.path.join("/")}>
                <TableRow
                  className="h-12 cursor-pointer"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </ImageModel>
            ) : (
              <TableRow
                key={row.id}
                className={cn(
                  "h-12 cursor-pointer",
                  row.original.type === "dir" &&
                    "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700",
                )}
                onClick={() => {
                  if (row.original.type === "dir") {
                    router.push(
                      `/plugins/${plugin.id}/browser/explore/${relativePath.join("/")}/${row.original.name}`,
                    );
                  } else {
                    // 判断文件是否已经打开
                    const exist = openedFiles.find(
                      (file) =>
                        file.path.join("/") === row.original.path.join("/"),
                    );
                    if (!exist) {
                      setOpenedFiles([
                        {
                          name: row.original.name,
                          path: row.original.path,
                        },
                        ...openedFiles,
                      ]);
                    }
                    router.push(
                      `/plugins/${plugin.id}/files/${relativePath.join("/")}/${row.original.name}`,
                    );
                  }
                }}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={filesTableColumns.length}
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
  const { table } = useBrowserContext();

  return (
    <div className="px-2 flex flex-col gap-2">
      {table && <FilesTableToolbar />}
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
      {table && <DataTablePagination persist name="explore" table={table} />}
    </div>
  );
}
