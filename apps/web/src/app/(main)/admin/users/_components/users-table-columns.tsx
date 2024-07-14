"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Badge } from "@/app/_components/ui/badge";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { DataTableColumnHeader } from "@/app/_components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export type UserCol = {
  id: string;
  avatar: string | null;
  bio: string | null;
  username: string;
  role: "ADMIN" | "USER";
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
};

export const usersTableColumns: ColumnDef<UserCol>[] = [
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
    accessorKey: "avatar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avatar" />
    ),
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.avatar ?? ""} />
        <AvatarFallback>{row.original.username.slice(0, 2)}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => <div>{row.original.username}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    filterFn: (row, _id, value) => value.includes(row.original.role),
    cell: ({ row }) =>
      row.original.role === "ADMIN" ? (
        <Badge>Admin</Badge>
      ) : (
        <Badge variant="outline">User</Badge>
      ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => <div>{row.original.createdAt.toDateString()}</div>,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => <div>{row.original.updatedAt.toDateString()}</div>,
  },
  {
    accessorKey: "lastLogin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Login" />
    ),
    cell: ({ row }) =>
      row.original.lastLogin ? (
        <div>{row.original.lastLogin.toDateString()}</div>
      ) : (
        <div>Never</div>
      ),
  },
];
