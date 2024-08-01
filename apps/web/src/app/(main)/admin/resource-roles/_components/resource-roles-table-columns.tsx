"use client";

import valhallaConfig from "@/valhalla";
import {
  Checkbox,
  DataTableColumnHeader,
} from "@sacred-craft/valhalla-components";
import { ResourceRole, User } from "@sacred-craft/valhalla-database";
import { ColumnDef } from "@tanstack/react-table";

export type RoleCol = ResourceRole & {
  users: User[];
};

export const resourceRolesTableColumns: ColumnDef<RoleCol>[] = [
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
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <div>{row.original.role}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {row.original.createdAt.toLocaleString(
          undefined,
          valhallaConfig.dateOptions,
        )}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {row.original.updatedAt.toLocaleString(
          undefined,
          valhallaConfig.dateOptions,
        )}
      </span>
    ),
  },
];
