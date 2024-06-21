"use client";

import { File as FileIcon, Folder } from "lucide-react";

import { ValhallaFile } from "@/app/actions";
import { Template } from "@/config/types";
import { ColumnDef, RowData } from "@tanstack/react-table";

import { FilesTableColumnHeader } from "@/components/plugin/browser/files-table-column-header";
import { FilesTableRowActions } from "@/components/plugin/browser/files-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export type FileCol = ValhallaFile & { template?: Template };

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
      return <span className="font-semibold truncate">{name}</span>;
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
    refresh: () => void;
  }
}
