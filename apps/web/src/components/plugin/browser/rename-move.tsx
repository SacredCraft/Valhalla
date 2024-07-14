import { useState } from "react";
import { toast } from "sonner";

import { usePluginContext } from "@/app/(main)/plugins/[plugin]/layout.client";
import { renameFile } from "@/app/actions";
import { Row, Table } from "@tanstack/react-table";

import { FileCol } from "@/components/plugin/browser/files-table-columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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

interface RenameMoveProps {
  row: Row<FileCol>;
  table: Table<FileCol>;
}

export function RenameMove({ row, table }: RenameMoveProps) {
  const { plugin } = usePluginContext();
  const [path, setPath] = useState(
    row.original.path.map((i) => `/${i}`).join(""),
  );

  const handleRename = () => {
    renameFile(
      plugin.id,
      row.original.path.map((i) => `/${i}`).join(""),
      path,
    ).then(() => {
      table.options.meta?.refresh();
      toast.success("File renamed");
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
