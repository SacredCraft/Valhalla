import { toast } from "sonner";

import { FileCol } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/files-table-columns";
import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/app/_components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { api } from "@/trpc/react";
import { Row, Table } from "@tanstack/react-table";

interface DeleteProps {
  row: Row<FileCol>;
  table: Table<FileCol>;
}

export function Delete({ row, table }: DeleteProps) {
  const { resource, setOpenedFiles } = useResourceContext();

  const moveToTrash = api.files.moveToTrash.useMutation({
    onSuccess: () => {
      setOpenedFiles((prev) => {
        if (!prev) return prev;
        return prev.filter(
          (file) => file.path.join("/") !== row.original.path.join("/"),
        );
      });
      toast.success("File moved to trash bin");
      table.options.meta?.refresh();
    },
    onError: () => {
      toast.error("Failed to move the file to trash bin");
    },
  });

  const deleteFile = api.files.deleteResourceFile.useMutation({
    onSuccess: () => {
      setOpenedFiles((prev) => {
        if (!prev) return prev;
        return prev.filter(
          (file) => file.path.join("/") !== row.original.path.join("/"),
        );
      });
      toast.success("File deleted");
      table.options.meta?.refresh();
    },
    onError: () => {
      toast.error("Failed to delete the file");
    },
  });

  const handleDelete = () => {
    deleteFile.mutate({
      name: resource.name,
      relativePath: row.original.path,
    });
  };

  const handleMoveToTrash = () => {
    moveToTrash.mutate({
      name: resource.name,
      relativePath: row.original.path,
    });
  };

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
              <Button variant="default" onClick={() => handleMoveToTrash()}>
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
                onClick={() => handleDelete()}
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
