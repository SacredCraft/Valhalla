import { useRouter } from "next/navigation";
import React from "react";

import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { Trash } from "@/server/api/routers/files";
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
  toast,
} from "@sacred-craft/valhalla-components";
import { Row } from "@tanstack/react-table";

interface DeleteProps {
  row: Row<Trash>;
}

export const Delete = ({ row }: DeleteProps) => {
  const { resource } = useResourceContext();
  const router = useRouter();

  const deleteResource = api.files.deleteFromTrash.useMutation({
    onSuccess: () => {
      toast.success("Deleted successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClick = () => {
    deleteResource.mutate({
      resource: resource.name,
      trashName: row.original.trashName,
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Delete</SheetTitle>
          <SheetDescription>
            Are you sure you want to delete this file?
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="mt-2">
          <SheetClose asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button size="sm" onClick={() => handleClick()}>
              Delete
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
