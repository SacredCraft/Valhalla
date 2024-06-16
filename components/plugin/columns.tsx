"use client";

import Link from "next/link";

import {
  Copy,
  Delete,
  Edit,
  File as FileIcon,
  Folder,
  FolderPen,
} from "lucide-react";
import { toast } from "sonner";

import { File, deleteFile, renameFile } from "@/app/actions";
import { ColumnDef, RowData } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type FileCol = Omit<File, "files"> & {
  status: "active" | "inactive";
  files?: FileCol[];
};

export const columns: ColumnDef<FileCol>[] = [
  {
    accessorKey: "dir",
    header: "Type",
    cell: ({ row }) => {
      return (row.getValue("dir") as boolean) ? (
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return status === "active" ? (
        <Badge variant="default">Active</Badge>
      ) : (
        <Badge variant="outline">Inactive</Badge>
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
      const path = row.original.path;
      const pluginPath = table.options.meta?.getPluginPath()!!;
      const pluginId = table.options.meta?.getPluginId();
      const actualPath = path.replace(pluginPath, "");
      return (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7"
                disabled={row.original.dir}
              >
                <Link href={`/${pluginId}/editor/${actualPath}`}>
                  <Edit className="size-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit the configuration</TooltipContent>
          </Tooltip>
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
                    const newPath = path.replace(row.original.name, name);
                    renameFile(path, newPath);
                    table.options.meta?.refreshData();
                  }
                }}
              >
                <FolderPen className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rename</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(row.original.path).then((res) => {
                    if (!res) {
                      toast.error("Failed to delete the file");
                    }
                    table.options.meta?.refreshData();
                  });
                }}
              >
                <Delete className="size-4" />
              </Button>
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
                  navigator.clipboard.writeText(
                    path.slice(pluginPath.length + 1),
                  );
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
    refreshData: () => void;
    goBack: () => void;
    getPluginPath: () => string | undefined;
    getPluginId: () => string;
  }
}
