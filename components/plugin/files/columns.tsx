"use client";

import {
  Copy,
  Delete,
  File as FileIcon,
  Folder,
  FolderPen,
} from "lucide-react";
import { toast } from "sonner";

import { File, deleteFile, renameFile } from "@/app/actions";
import { Plugin } from "@/config/types";
import { findFileAttributes } from "@/config/utils";
import { ColumnDef, RowData } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<File>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return row.getValue("type") === "dir" ? (
        <Folder className="fill-current text-primary" />
      ) : (
        <FileIcon />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;
      return <span className="font-semibold">{name}</span>;
    },
  },
  {
    header: "Template",
    cell: ({ row, table }) => {
      const plugin = table.options.meta?.getPlugin()!!;
      const path = table.options.meta?.getPath()!!;
      const attributes = findFileAttributes(
        plugin.files,
        [...path, row.original.name],
        row.original.name,
      );
      if (row.original.type === "dir") {
        return <Badge variant="default">Directory</Badge>;
      }
      return attributes?.template ? (
        <Badge variant="default">{attributes.template.name}</Badge>
      ) : (
        <Badge variant="outline">None</Badge>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const size = row.original.size;
      return (
        <span>
          {size > 1024 * 1024
            ? `${(size / (1024 * 1024)).toFixed(2)} MB`
            : size > 1024
              ? `${(size / 1024).toFixed(2)} KB`
              : `${size} B`}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const relativePath = [
        ...(table.options.meta?.getPath() ?? []),
        row.original.name,
      ];
      return (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  const name = prompt("Enter the new name", row.original.name);
                  if (name) {
                    const newPath = row.original.path
                      .join("/")
                      .replace(row.original.name, name);
                    renameFile(row.original.path.join("/"), newPath).then(() =>
                      table.options.meta?.refresh(),
                    );
                  }
                }}
              >
                <FolderPen className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rename</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-7 w-7">
                    <Delete className="size-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure you want to delete this file?
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">No</Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deleteFile(row.original.path.join("/")).then((res) => {
                          if (!res) {
                            toast.error("Failed to delete the file");
                          } else {
                            table.options.meta?.refresh();
                          }
                        });
                      }}
                    >
                      Yes
                    </Button>
                    <Button variant="default">Move it to Trash Bin</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(relativePath.join("/"));
                }}
              >
                <Copy className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy path</TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    setData: (data: TData[]) => void;
    getPlugin: () => Plugin;
    getPath: () => string[];
    refresh: () => void;
  }
}
