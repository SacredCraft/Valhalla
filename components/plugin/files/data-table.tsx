"use client";

import { usePathname, useRouter } from "next/navigation";

import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { File, revalidate } from "@/app/actions";
import { Plugin } from "@/config/types";
import { findFileAttributes } from "@/config/utils";
import { Trash, emptyTrash } from "@/lib/core";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageModel } from "@/components/ui/image-model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { columns } from "./columns";

interface DataTableProps {
  plugin: Plugin;
  files: File[];
  path: string[];
  trash: Trash[];
  pluginPath: string;
}

export function DataTable({
  plugin,
  path,
  files,
  trash,
  pluginPath,
}: DataTableProps) {
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
    <Template
      count={data.length}
      table={table}
      trash={trash}
      plugin={plugin}
      pluginPath={pluginPath}
    >
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  );
}

function Template({
  count,
  children,
  table,
  trash,
  plugin,
  pluginPath,
}: {
  count?: number;
  children: React.ReactNode;
  table: ReturnType<typeof useReactTable<File>>;
  trash: Trash[];
  plugin: Plugin;
  pluginPath: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Files Browser
          <Tooltip>
            <TooltipTrigger className="ml-auto">
              <Dialog>
                <DialogTrigger>
                  <Button variant="outline" size="icon">
                    <TrashIcon className="size-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Trash Bin</DialogTitle>
                    <DialogDescription>
                      Manage and restore deleted configurations
                    </DialogDescription>
                  </DialogHeader>
                  {trash.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File Name</TableHead>
                          <TableHead>Deleted By</TableHead>
                          <TableHead>Deleted At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trash.map((file) => (
                          <TableRow key={file.fileName}>
                            <TableCell>{file.fileName}</TableCell>
                            <TableCell>{file.operator}</TableCell>
                            <TableCell>{file.deletedAt}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      No files in trash bin
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        emptyTrash(pluginPath).then(() => {
                          table.options.meta?.refresh();
                          toast.success("Trash bin emptied");
                        });
                      }}
                    >
                      Empty Trash Bin
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TooltipTrigger>
            <TooltipContent>Trash Bin</TooltipContent>
          </Tooltip>
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
          Showing <strong>1-10</strong> of <strong>{count ?? 0}</strong>{" "}
          configurations
        </div>
      </CardFooter>
    </Card>
  );
}
