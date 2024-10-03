"use client";

import { Star } from "lucide-react";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "@sacred-craft/valhalla-components";
import { Row } from "@tanstack/react-table";

import { useRelativePath, useResourceContext } from "../../layout.client";
import { BrowserCol } from "./browser-table-columns";
import { CopyCutRowAction } from "./copy-cut";
import { Delete } from "./delete";
import { RenameMove } from "./rename-move";

interface BrowserTableRowActionsProps {
  row: Row<BrowserCol>;
}

export function BrowserTableRowActions({ row }: BrowserTableRowActionsProps) {
  const { resource } = useResourceContext();
  const relativeFolderPath = useRelativePath();
  const relativePath = [...relativeFolderPath!!, row.original.name];

  const handleDownload = () => {
    fetch(
      `/api/files?${new URLSearchParams({ relativePath: relativePath.join("/"), resource: resource.name }).toString()}`,
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
          <RenameMove row={row} />
          <CopyCutRowAction row={row} />
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
          <Delete row={row} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
