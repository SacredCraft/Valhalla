import { ArchiveRestore } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

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

import { useResourceContext } from "../../files/[[...slug]]/layout.client";
import { useTrashContext } from "../layout.client";

export const RestoreAll = () => {
  const { resource } = useResourceContext();
  const { trash } = useTrashContext();
  const router = useRouter();

  const restoreAll = api.files.restoreAllFromTrash.useMutation({
    onSuccess: () => {
      toast.success("All trash files restored");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClick = () => {
    restoreAll.mutate({
      resource: resource.name,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2"
          disabled={!trash?.length}
        >
          <ArchiveRestore className="size-4 mr-1" />
          Restore All
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Restore All</SheetTitle>
          <SheetDescription>
            Are you sure you want to restore all files in the trash?
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
              Restore All
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
