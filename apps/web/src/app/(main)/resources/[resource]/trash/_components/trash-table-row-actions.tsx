"use client";

import { Trash } from "@/server/api/routers/files";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  toast,
} from "@sacred-craft/valhalla-components";
import { Row } from "@tanstack/react-table";

import { useResourceContext } from "../../files/[[...slug]]/layout.client";
import { Delete } from "./delete";
import { Restore } from "./restore";

interface TrashTableRowActionsProps {
  row: Row<Trash>;
}

export function TrashTableRowActions({ row }: TrashTableRowActionsProps) {
  const { resource } = useResourceContext();

  const handleDownload = () => {
    fetch(
      `/api/trash?${new URLSearchParams({ trashName: row.original.trashName, resource: resource.name }).toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => {
      if (res.ok) {
        res.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = row.original.originName;
          a.click();
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Restore row={row} />
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
          <DropdownMenuItem onClick={() => handleDownload()}>
            Download
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard
                .writeText(row.original.path.join("/"))
                .then(() => {
                  toast.success("Path copied to clipboard");
                })
            }
          >
            Copy full path
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Delete row={row} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
