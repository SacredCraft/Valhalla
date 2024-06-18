"use client";

import { usePathname, useRouter } from "next/navigation";

import { createContext, useContext, useEffect, useState } from "react";

import { useFilesContext } from "@/app/[plugin]/files/[[...path]]/page.client";
import { File, revalidate } from "@/app/actions";
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

import { FilesTablePagination } from "@/components/plugin/files/files-table-pagination";
import { FilesTableToolbar } from "@/components/plugin/files/files-table-toolbar";
import { TrashBin } from "@/components/plugin/files/trash-bin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageModel } from "@/components/ui/image-model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FileCol, filesTableColumns } from "./files-table-columns";
import { New } from "./new";

type ContextType = {
  table: ReturnType<typeof useReactTable<File>>;
};

export const FilesTableContext = createContext<ContextType | undefined>(
  undefined,
);

export const useFilesTableContext = () => {
  const context = useContext(FilesTableContext);
  if (!context) {
    throw new Error(
      "useFilesTableContext must be used within a FilesTableProvider",
    );
  }
  return context;
};

export function FilesTable() {
  const { plugin, pluginPath, path, trash, files } = useFilesContext();
  const [data, setData] = useState<FileCol[]>(files);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setData(files);
  }, [files]);

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
      getPlugin: () => plugin,
      getPath: () => path,
      refresh: () => revalidate(pathname),
    },
  });

  return (
    <FilesTableContext.Provider value={{ table }}>
      <Template>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const relativePath = [...path, row.original.name];
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
                  className={cn(
                    "h-12 cursor-pointer",
                    row.original.type === "dir" &&
                      "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
                  )}
                  onClick={() => {
                    if (row.original.type === "dir") {
                      router.push(
                        `/${plugin.id}/files/${table.options.meta?.getPath().join("/")}/${row.original.name}`,
                      );
                    } else {
                      router.push(
                        `/${plugin.id}/editor/${relativePath.join("/")}`,
                      );
                    }
                  }}
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
    </FilesTableContext.Provider>
  );
}

function Template({ children }: { children: React.ReactNode }) {
  const { table } = useFilesTableContext();
  return (
    <Card>
      <CardHeader className="p-4 pb-2 space-y-0.5">
        <CardTitle className="text-lg">Files Browser</CardTitle>
        <CardDescription className="text-lg">
          Browse and manage configurations for the plugin
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 py-2 space-y-2">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <New />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {table.getSelectedRowModel().rows.length !== 0 && (
              <Button className="h-8" variant="destructive">
                Delete Selected ({table.getSelectedRowModel().rows.length})
              </Button>
            )}
            <TrashBin />
          </div>
        </div>
        <FilesTableToolbar />
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
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
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <FilesTablePagination table={table} />
      </CardFooter>
    </Card>
  );
}
