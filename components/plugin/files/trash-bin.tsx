import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { useFilesContext } from "@/app/[plugin]/files/[[...path]]/page.client";
import { emptyTrash } from "@/lib/core";

import { useFilesTableContext } from "@/components/plugin/files/files-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TrashBin() {
  const { table } = useFilesTableContext();
  const { trash, pluginPath } = useFilesContext();
  return (
    <Tooltip>
      <TooltipTrigger>
        <Dialog>
          <DialogTrigger>
            <Button variant="outline" size="sm" className="h-8">
              <TrashIcon className="mr-2 h-4 w-4" />
              Trash Bin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Trash Bin</DialogTitle>
              <DialogDescription>
                Manage and restore deleted configurations
              </DialogDescription>
            </DialogHeader>
            {trash.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Deleted By</TableHead>
                    <TableHead>Deleted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trash.map((file) => (
                    <TableRow key={file.fileName}>
                      <TableCell>{file.fileName}</TableCell>
                      <TableCell>{file.operator}</TableCell>
                      <TableCell>{file.deletedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-muted-foreground">
                No files in trash bin
              </div>
            )}
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  emptyTrash(pluginPath).then(() => {
                    table.options.meta?.refresh();
                    toast.success("Trash bin emptied");
                  });
                }}
              >
                Empty Trash Bin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipTrigger>
      <TooltipContent>Open Trash Bin</TooltipContent>
    </Tooltip>
  );
}
