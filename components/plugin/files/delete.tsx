import { toast } from "sonner";

import { deleteFile } from "@/app/actions";
import { moveToTrash } from "@/lib/core";
import { Row, Table } from "@tanstack/react-table";

import { FileCol } from "@/components/plugin/files/files-table-columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

interface DeleteProps {
  row: Row<FileCol>;
  table: Table<FileCol>;
}

export function Delete({ row, table }: DeleteProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this file?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-y-2">
          {row.original.type === "file" && (
            <DialogClose>
              <Button
                variant="default"
                onClick={() => {
                  moveToTrash(row.original.path, "admin").then(() => {
                    toast.success("File moved to trash bin");
                    table.options.meta?.refresh();
                  });
                }}
              >
                Move it to Trash Bin
              </Button>
            </DialogClose>
          )}
          <div className="flex gap-2 sm:ml-auto">
            <DialogClose>
              <Button variant="outline" className="w-full sm:w-fit">
                No
              </Button>
            </DialogClose>
            <DialogClose>
              <Button
                className="w-full sm:w-fit"
                variant="destructive"
                onClick={() => {
                  deleteFile(row.original.path.join("/")).then((res) => {
                    if (!res) {
                      toast.error("Failed to delete the file");
                    } else {
                      table.options.meta?.refresh();
                    }
                  });
                }}
              >
                Yes
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
