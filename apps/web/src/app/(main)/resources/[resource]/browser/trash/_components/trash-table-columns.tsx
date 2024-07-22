"use client";

import { Trash } from "@/server/api/routers/files";
import valhallaConfig from "@/valhalla";
import {
  Badge,
  Checkbox,
  DataTableColumnHeader,
  formatBytes,
} from "@sacred-craft/valhalla-components";
import { ColumnDef } from "@tanstack/react-table";

import { TrashTableRowActions } from "./trash-table-row-actions";

export const trashTableColumns: ColumnDef<Trash>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    filterFn: (rows, id, filterValue) => {
      return rows.original.originName
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
    cell: ({ row }) => {
      const name = row.original.originName;
      return <span className="font-semibold truncate">{name}</span>;
    },
  },
  {
    accessorKey: "path",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Path" />
    ),
    cell: ({ row }) => {
      const path =
        row.original.path.length === 1
          ? "/"
          : row.original.path.slice(0, -1).map((p) => `/${p}`);
      return <span className="truncate">{path}</span>;
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
    accessorKey: "operator",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Operator" />
    ),
    cell: ({ row }) => {
      const operator = row.original.operator;
      return (
        <span>
          {typeof operator === "object" ? operator.username : operator}
        </span>
      );
    },
  },
  {
    accessorKey: "deletedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deleted At" />
    ),
    cell: ({ row }) => {
      const updatedAt = row.original.timestamp;
      return (
        <span suppressHydrationWarning>
          {new Date(updatedAt).toLocaleString(
            undefined,
            valhallaConfig.dateOptions,
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row, table }) => <TrashTableRowActions row={row} table={table} />,
    enableSorting: false,
    enableHiding: false,
  },
];
