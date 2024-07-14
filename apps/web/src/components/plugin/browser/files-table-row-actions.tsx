"use client";

import { Star } from "lucide-react";
import { toast } from "sonner";

import { useBrowserContext } from "@//app/(main)/plugins/[plugin]/browser/layout.client";
import { usePluginContext } from "@//app/(main)/plugins/[plugin]/layout.client";
import { CopyCutRowAction } from "@//components/plugin/browser/copy-cut";
import { Delete } from "@//components/plugin/browser/delete";
import { FileCol } from "@//components/plugin/browser/files-table-columns";
import { RenameMove } from "@//components/plugin/browser/rename-move";
import { Button } from "@//components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@//components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@//components/ui/tooltip";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row, Table } from "@tanstack/react-table";

interface FilesTableRowActionsProps {
  row: Row;
  table: Table;
}

export function FilesTableRowActions({
  row,
  table,
}: FilesTableRowActionsProps) {
  const { plugin } = usePluginContext();
  const { relativePath: relativeFolderPath } = useBrowserContext();
  const relativePath = [...relativeFolderPath!!, row.original.name];

  const handleDownload = () => {
    fetch(
      `/api/files?${new URLSearchParams({ relativePath: relativePath.join("/"), pluginId: plugin.id }).toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => {
      res.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = row.original.name;
        a.click();
      });
    });
  };

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
          <RenameMove row={row} table={table} />
          <CopyCutRowAction row={row} table={table} />
          {row.original.type === "file" && (
            <DropdownMenuItem onClick={() => handleDownload()}>
              Download
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(relativePath.join("/")).then(() => {
                toast.success("Path copied to clipboard");
              })
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
