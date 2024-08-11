"use client";

import valhallaConfig from "@/valhalla";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Checkbox,
  DataTableColumnHeader,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@sacred-craft/valhalla-components";
import { Log, User } from "@sacred-craft/valhalla-database";
import { ColumnDef } from "@tanstack/react-table";

import { LogItem } from "./log-item";

export type LogCol = Log & {
  operators: User[];
};

export const logsTableColumns: ColumnDef<LogCol>[] = [
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
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <LogItem log={row.original} />,
  },
  {
    accessorKey: "operators",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Operators" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center h-auto">
        {row.original.operators.map((operator) => (
          <Tooltip>
            <TooltipTrigger>
              <Avatar
                key={operator.id}
                className="relative flex shrink-0 overflow-hidden group size-6 rounded-full -ms-2 [&:is(:first-child):is(:last-child)]:hover:-translate-x-0 hover:-translate-x-3 rtl:[&:is(:first-child):is(:last-child)]:hover:translate-x-0 rtl:hover:translate-x-3 transition-transform [&:is(:first-child):is(:last-child)]:focus-visible:-translate-x-0 rtl:[&:is(:first-child):is(:last-child)]:focus-visible:translate-x-0 focus-visible:translate-x-3 ring-2 ring-offset-2 ring-offset-background ring-primary"
              >
                <AvatarImage
                  src={operator.avatar ?? undefined}
                  alt={operator.username}
                />
                <AvatarFallback>{operator.username.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>{operator.username}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    ),
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
];
