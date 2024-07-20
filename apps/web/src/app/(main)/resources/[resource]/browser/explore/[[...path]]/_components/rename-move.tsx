import { useState } from "react";
import { toast } from "sonner";

import { FileCol } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/files-table-columns";
import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/app/_components/ui/dropdown-menu";
import { Input } from "@/app/_components/ui/input";
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

interface RenameMoveProps {
  row: Row<FileCol>;
  table: Table<FileCol>;
}

export function RenameMove({ row, table }: RenameMoveProps) {
  const { resource } = useResourceContext();
  const [path, setPath] = useState(
    row.original.path.map((i) => `/${i}`).join(""),
  );

  const renameFile = api.files.renameResourceFile.useMutation({
    onSuccess: () => {
      table.options.meta?.refresh();
      toast.success("File renamed");
    },
    onError: (error) => {
      toast.error("Failed to rename the file");
    },
  });

  const handleRename = () => {
    renameFile.mutate({
      name: resource.name,
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
        <SheetFooter>
          <SheetClose>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose>
            <Button variant="default" onClick={handleRename}>
              Save
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
