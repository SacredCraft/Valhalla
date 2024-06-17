"use client";

import { usePathname, useRouter } from "next/navigation";

import { createContext, useContext, useEffect, useState } from "react";

import { useFilesContext } from "@/app/[plugin]/files/[[...path]]/page.client";
import { File, revalidate } from "@/app/actions";
import { findFileAttributes } from "@/config/utils";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { TrashBin } from "@/components/plugin/files/trash-bin";
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

import { columns } from "./columns";

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

export function DataTable() {
  const { plugin, pluginPath, path, trash, files } = useFilesContext();
  const [data, setData] = useState<File[]>(files);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setData(files);
  }, [files]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
              const attributes = findFileAttributes(
                plugin.files,
                [...path, row.original.name],
                row.original.name,
              );
              const relativePath = [...path, row.original.name];
              const isImage = attributes.template?.name === "Image";
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
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
      <CardHeader>
        <CardTitle className="flex items-center">
          Files Browser
          <TrashBin />
        </CardTitle>
        <CardDescription>
          Browse and manage configurations for the plugin
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of{" "}
          <strong>{table.options.data.length ?? 0}</strong> configurations
        </div>
      </CardFooter>
    </Card>
  );
}
