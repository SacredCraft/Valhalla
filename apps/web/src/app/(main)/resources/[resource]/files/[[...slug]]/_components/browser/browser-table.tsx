"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useResourceContext } from "../../layout.client";
import { useRelativePath } from "../../layout.client";
import { useBrowserStore } from "./browser-page";
import { browserTableColumns } from "./browser-table-columns";
import { BrowserTableToolbar } from "./browser-table-toolbar";
import { ImageModel } from "./image-model";

export function BrowserTable() {
  const { resource, setOpenedFiles, openedFiles } = useResourceContext();
  const relativePath = useRelativePath();
  const {
    data,
    setTable,
    sorting,
    columnVisibility,
    rowSelection,
    columnFilters,
    setSorting,
    setColumnVisibility,
    setRowSelection,
    setColumnFilters,
  } = useBrowserStore((state) => state);

  if (!relativePath || !data) {
    throw new Error("relativePath and files are required");
  }

  const router = useRouter();

  const table = useReactTable({
    data,
    columns: browserTableColumns,
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
    setRowSelection({});
  }, [data]);

  useEffect(() => {
    setTable(table);
  }, [setTable, table]);

  return (
    <Template>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const isImage =
              row.original.template?.options?.browser &&
              row.original.template.options?.browser?.onClick &&
              // eslint-disable-next-line no-unsafe-optional-chaining
              row.original.template.options?.browser?.onClick ===
                "preview-image";

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
                      `/resources/${resource.name}/files/${relativePath.join("/")}/${row.original.name}`,
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
                      `/resources/${resource.name}/files/${relativePath.join("/")}/${row.original.name}`,
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
              colSpan={browserTableColumns.length}
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
  const { table } = useBrowserStore((state) => state);

  return (
    <div className="px-2 flex flex-col gap-2">
      {table && <BrowserTableToolbar />}
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
      {table && <DataTablePagination persist name="explore" table={table} />}
    </div>
  );
}
