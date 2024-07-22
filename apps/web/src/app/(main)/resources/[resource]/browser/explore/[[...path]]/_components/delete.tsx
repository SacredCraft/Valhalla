import { useRouter } from "next/navigation";

import { FileCol } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/files-table-columns";
import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { api } from "@/trpc/react";
import {
  Button,
  DropdownMenuItem,
  DropdownMenuShortcut,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  cn,
  toast,
} from "@sacred-craft/valhalla-components";
import { Row, Table } from "@tanstack/react-table";

interface DeleteProps {
  row: Row<FileCol>;
  table: Table<FileCol>;
}

export function Delete({ row, table }: DeleteProps) {
  const { resource, setOpenedFiles } = useResourceContext();
  const router = useRouter();

  const moveToTrash = api.files.moveToTrash.useMutation({
    onSuccess: () => {
      setOpenedFiles((prev) => {
        if (!prev) return prev;
        return prev.filter(
          (file) => file.path.join("/") !== row.original.path.join("/"),
        );
      });
      toast.success("File moved to trash bin");
      router.refresh();
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
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to delete the file");
    },
  });

  const handleDelete = () => {
    deleteFile.mutate({
      resource: resource.name,
      relativePath: row.original.path,
    });
  };

  const handleMoveToTrash = () => {
    moveToTrash.mutate({
      resource: resource.name,
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
        <SheetFooter className="flex flex-col sm:flex-row sm:justify-between gap-y-2 mt-2">
          {row.original.type === "file" && (
            <SheetClose asChild>
              <Button
                size="sm"
                variant="default"
                onClick={() => handleMoveToTrash()}
                className="sm:mr-auto"
              >
                Move to trash
              </Button>
            </SheetClose>
          )}
          <SheetClose asChild>
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "w-full sm:w-fit",
                row.original.type === "dir" ? "ml-auto" : undefined,
              )}
            >
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              size="sm"
              className="w-full sm:w-fit"
              variant="destructive"
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
