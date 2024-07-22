"use client";

import { DeleteIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { api } from "@/trpc/react";
import {
  Button,
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

import { useExploreContext } from "../layout.client";

export function SelectedDelete() {
  const { resource } = useResourceContext();
  const { rowSelection, data } = useExploreContext();
  const router = useRouter();

  const moveToTrash = api.files.moveToTrash.useMutation();
  const deleteFile = api.files.deleteResourceFile.useMutation();

  const selectedRows = useMemo(
    () => Object.keys(rowSelection).map((index) => data[parseInt(index, 10)]),
    [rowSelection, data],
  );

  const containsFolder = selectedRows.some((row) => row?.type === "dir");

  const handleDelete = () => {
    const errors: string[] = [];
    selectedRows.forEach((row) => {
      if (!row) {
        return;
      }
      deleteFile.mutate(
        {
          resource: resource.name,
          relativePath: row.path,
        },
        {
          onError: (error) => {
            errors.push(error.message);
          },
        },
      );
    });
    if (errors.length > 0) {
      toast.error("Failed to delete files");
    } else {
      toast.success("Files deleted");
      router.refresh();
    }
  };

  const handleMoveToTrash = () => {
    const errors: string[] = [];
    selectedRows.forEach((row) => {
      if (!row) {
        return;
      }
      moveToTrash.mutate(
        {
          resource: resource.name,
          relativePath: row.path,
        },
        {
          onError: (error) => {
            errors.push(error.message);
          },
        },
      );
    });
    if (errors.length > 0) {
      toast.error("Failed to move files to trash bin");
    } else {
      toast.success("Files moved to trash bin");
      router.refresh();
    }
  };

  const length = useMemo(
    () => Object.keys(rowSelection).length,
    [rowSelection],
  );

  if (length === 0) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <DeleteIcon className="mr-1 h-4 w-4" />
          Delete Selected({length})
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Delete files</SheetTitle>
          <SheetDescription>
            Are you sure you want to delete the selected files?
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="flex flex-col sm:flex-row sm:justify-between gap-y-2 mt-2">
          {!containsFolder && (
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
                containsFolder ? "ml-auto" : undefined,
              )}
            >
              Cancel
            </Button>
          </SheetClose>
          <Button size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
