import { useBrowserContext } from "@/app/(main)/resources/[resource]/browser/layout.client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sacred-craft/valhalla-components";

export function TrashBin() {
  const { trash } = useBrowserContext();

  return (
    <div className="px-2 flex flex-col gap-2">
      {trash?.length ? (
        <div className="border rounded-lg">
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
        <div className="text-center text-muted-foreground">
          No files in trash bin
        </div>
      )}
    </div>
  );
}
