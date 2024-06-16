"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { revalidateFiles } from "@/app/actions";
import { File } from "@/app/actions";
import { Plugin } from "@/config/types";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { columns } from "./columns";

interface DataTableProps {
  plugin: Plugin;
  files: File[];
  path: string[];
}

export function DataTable({ plugin, path, files }: DataTableProps) {
  const [data, setData] = useState<File[]>(files);
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      setData,
      getPlugin: () => plugin,
      getPath: () => path,
      refresh: async () => {
        await revalidateFiles(plugin, path);
      },
    },
  });

  return (
    <Template count={data.length} table={table}>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn(
                "h-12",
                row.original.type === "dir" &&
                  "cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
              )}
              data-state={row.getIsSelected() && "selected"}
              onClick={() => {
                if (row.original.type === "dir") {
                  router.push(
                    `/${plugin.id}/files/${table.options.meta?.getPath().join("/")}/${row.original.name}`,
                  );
                }
              }}
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
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No files found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Template>
  );
}

function Template({
  count,
  children,
  table,
}: {
  count?: number;
  children: React.ReactNode;
  table: ReturnType<typeof useReactTable<File>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Files Browser</CardTitle>
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
          Showing <strong>1-10</strong> of <strong>{count ?? 0}</strong>{" "}
          configurations
        </div>
      </CardFooter>
    </Card>
  );
}
