import { useBrowserContext } from "@//app/(main)/plugins/[plugin]/browser/layout.client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@//components/ui/table";

export function TrashBin() {
  const { trash } = useBrowserContext();

  return (
    <div className="flex flex-col gap-2 px-2">
      {trash?.length ? (
        <div className="rounded-lg border">
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
        </div>
      ) : (
        <div className="text-muted-foreground text-center">
          No files in trash bin
        </div>
      )}
    </div>
  );
}
