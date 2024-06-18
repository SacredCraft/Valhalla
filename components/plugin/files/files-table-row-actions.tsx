"use client";

import { Star } from "lucide-react";

import { renameFile } from "@/app/actions";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row, Table } from "@tanstack/react-table";

import { Delete } from "@/components/plugin/files/delete";
import { FileCol } from "@/components/plugin/files/files-table-columns";
import { Rename } from "@/components/plugin/files/rename";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FilesTableRowActionsProps {
  row: Row<FileCol>;
  table: Table<FileCol>;
}

export function FilesTableRowActions({
  row,
  table,
}: FilesTableRowActionsProps) {
  const relativePath = [
    ...(table.options.meta?.getPath() ?? []),
    row.original.name,
  ];
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            onClick={(e) => e.stopPropagation()}
          >
            <Star className="size-4" />
            <span className="sr-only">Star</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Star</TooltipContent>
      </Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            onClick={(e) => e.stopPropagation()}
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[160px]"
          onClick={(e) => e.stopPropagation()}
        >
          <Rename row={row} table={table} />
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(relativePath.join("/"))
            }
          >
            Copy path
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Delete row={row} table={table} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
