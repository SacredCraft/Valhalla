"use client";

import { File as FileIcon, Folder } from "lucide-react";

import { FilesTableRowActions } from "@/app/(main)/plugins/[plugin]/browser/explore/[[...path]]/_components/files-table-row-actions";
import { Badge } from "@/app/_components/ui/badge";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { DataTableColumnHeader } from "@/app/_components/ui/data-table-column-header";
import { ValhallaFile } from "@/app/actions";
import { formatBytes } from "@/lib/utils";
import { Template } from "@/server/config/types";
import { ColumnDef, RowData } from "@tanstack/react-table";

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
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
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
      <DataTableColumnHeader column={column} title="Type" />
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
      <DataTableColumnHeader column={column} title="Name" />
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
      <DataTableColumnHeader column={column} title="Template" />
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
      <DataTableColumnHeader column={column} title="Size" />
    ),
    cell: ({ row }) => {
      const size = row.original.size;
      return <span>{formatBytes(size)}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
  },
  {
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
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
