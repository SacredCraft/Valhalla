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
import { Plugin, Template } from "@/config/types";
import { findFileAttributes } from "@/config/utils";
import { moveToTrash } from "@/lib/core";
import { ColumnDef, RowData } from "@tanstack/react-table";

import { FilesTableColumnHeader } from "@/components/plugin/files/files-table-column-header";
import { FilesTableRowActions } from "@/components/plugin/files/files-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export type FileCol = File & { template?: Template };

export const filesTableColumns: ColumnDef<FileCol>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <FilesTableColumnHeader column={column} title="Type" />
    ),
    filterFn: (row, _id, value) => value.includes(row.original.type),
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
    header: ({ column }) => (
      <FilesTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.original.name;
      return <span className="font-semibold">{name}</span>;
    },
  },
  {
    accessorKey: "template",
    filterFn: (row, _id, value: any[]) =>
      value.includes(row.original.template?.name ?? "None") &&
      row.original.type !== "dir",
    header: ({ column }) => (
      <FilesTableColumnHeader column={column} title="Template" />
    ),
    cell: ({ row }) => {
      if (row.original.type === "dir") {
        return <Badge variant="default">Directory</Badge>;
      }
      return row.original.template ? (
        <Badge variant="default">{row.original.template.name}</Badge>
      ) : (
        <Badge variant="outline">None</Badge>
      );
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <FilesTableColumnHeader column={column} title="Size" />
    ),
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
    header: ({ column }) => (
      <FilesTableColumnHeader column={column} title="Created At" />
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <FilesTableColumnHeader column={column} title="Updated At" />
    ),
  },
  {
    accessorKey: "actions",
    header: ({ column }) => (
      <FilesTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row, table }) => <FilesTableRowActions row={row} table={table} />,
    enableSorting: false,
    enableHiding: false,
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
