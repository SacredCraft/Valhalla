import { useState } from "react";
import { toast } from "sonner";

import { renameFile } from "@/app/actions";
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
import { Input } from "@/components/ui/input";

interface RenameProps {
  row: Row<FileCol>;
  table: Table<FileCol>;
}

export function Rename({ row, table }: RenameProps) {
  const [name, setName] = useState(row.original.name);

  const handleRename = () => {
    const newPath = row.original.path
      .join("/")
      .replace(row.original.name, name);
    renameFile(row.original.path.join("/"), newPath).then(() => {
      table.options.meta?.refresh();
      toast.success("File renamed");
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Rename
          <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
          <DialogDescription>
            Please enter a new name for the file.
          </DialogDescription>
        </DialogHeader>
        <Input value={name} onChange={(value) => setName(String(value))} />
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">No</Button>
          </DialogClose>
          <DialogClose>
            <Button variant="default" onClick={handleRename}>
              Rename
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
