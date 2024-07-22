import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

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
  toast,
} from "@sacred-craft/valhalla-components";

import { useTrashContext } from "../layout.client";

export const DeleteAll = () => {
  const { resource } = useResourceContext();
  const { trash } = useTrashContext();
  const router = useRouter();

  const deleteAll = api.files.deleteAllFromTrash.useMutation({
    onSuccess: () => {
      toast.success("All trash files deleted");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClick = () => {
    deleteAll.mutate({
      resource: resource.name,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="h-7 px-2"
          disabled={!trash?.length}
        >
          <TrashIcon className="mr-1 h-4 w-4" />
          Delete All
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Delete All</SheetTitle>
          <SheetDescription>
            Are you sure you want to delete all files in the trash?
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
              Delete All
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
