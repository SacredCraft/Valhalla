import { useRouter } from "next/navigation";
import { useState } from "react";

import { FileCol } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/files-table-columns";
import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { api } from "@/trpc/react";
import {
  Button,
  DropdownMenuItem,
  DropdownMenuShortcut,
  Input,
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
import { Row, Table } from "@tanstack/react-table";

interface RenameMoveProps {
  row: Row<FileCol>;
  table: Table<FileCol>;
}

export function RenameMove({ row, table }: RenameMoveProps) {
  const { resource } = useResourceContext();
  const router = useRouter();
  const [path, setPath] = useState(
    row.original.path.map((i) => `/${i}`).join(""),
  );

  const renameFile = api.files.renameResourceFile.useMutation({
    onSuccess: () => {
      toast.success("File renamed");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to rename the file");
    },
  });

  const handleRename = () => {
    renameFile.mutate({
      resource: resource.name,
      oldRelativePath: row.original.path,
      newRelativePath: path.split("/").filter((i) => i),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Rename & Move
          <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent onClick={(e) => e.stopPropagation()}>
        <SheetHeader>
          <SheetTitle>Rename or move file</SheetTitle>
          <SheetDescription>
            Please enter a new name for the file.
          </SheetDescription>
        </SheetHeader>
        <form className="my-4">
          <Input value={path} onChange={(value) => setPath(String(value))} />
        </form>
        <SheetFooter className="mt-2">
          <SheetClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="default" onClick={handleRename} size="sm">
              Save
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
