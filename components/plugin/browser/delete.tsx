import { toast } from "sonner";

import { usePluginContext } from "@/app/(main)/plugins/[plugin]/layout.client";
import { deleteFile } from "@/app/actions";
import { moveToTrash } from "@/lib/core";
import { Row, Table } from "@tanstack/react-table";

import { FileCol } from "@/components/plugin/browser/files-table-columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DeleteProps {
  row: Row<FileCol>;
  table: Table<FileCol>;
}

export function Delete({ row, table }: DeleteProps) {
  const { plugin } = usePluginContext();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent onClick={(e) => e.stopPropagation()}>
        <SheetHeader>
          <SheetTitle>Are you sure you want to delete this file?</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
        <SheetFooter className="flex flex-col sm:flex-row sm:justify-between gap-y-2 mt-4">
          {row.original.type === "file" && (
            <SheetClose>
              <Button
                variant="default"
                onClick={() => {
                  moveToTrash(plugin.id, row.original.path, "admin").then(
                    () => {
                      toast.success("File moved to trash bin");
                      table.options.meta?.refresh();
                    },
                  );
                }}
              >
                Move it to Trash Bin
              </Button>
            </SheetClose>
          )}
          <div className="flex gap-2 sm:ml-auto">
            <SheetClose>
              <Button variant="outline" className="w-full sm:w-fit">
                No
              </Button>
            </SheetClose>
            <SheetClose>
              <Button
                className="w-full sm:w-fit"
                variant="destructive"
                onClick={() => {
                  deleteFile(plugin.id, row.original.path.join("/")).then(
                    (res) => {
                      if (!res) {
                        toast.error("Failed to delete the file");
                      } else {
                        table.options.meta?.refresh();
                      }
                    },
                  );
                }}
              >
                Yes
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
