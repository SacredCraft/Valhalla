"use client";

import { ClipboardPaste } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { FileCol } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/files-table-columns";
import { useBrowserContext } from "@/app/(main)/resources/[resource]/browser/layout.client";
import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/app/_components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import { api } from "@/trpc/react";
import { Row, Table } from "@tanstack/react-table";

interface CopyCutRowActionProps {
  row: Row<FileCol>;
  table: Table<FileCol>;
}

export function CopyCutRowAction({ row, table }: CopyCutRowActionProps) {
  const { setCopyFiles, setCutFiles } = useBrowserContext();

  const copy = () => {
    setCutFiles?.(undefined);
    setCopyFiles?.([row.original.path.join("/")]);
  };

  const cut = () => {
    setCopyFiles?.(undefined);
    setCutFiles?.([row.original.path.join("/")]);
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          copy();
        }}
      >
        Copy
        <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          cut();
        }}
      >
        Cut
        <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  );
}

export function PasteAction() {
  const { resource } = useResourceContext();
  const {
    copyFiles,
    cutFiles,
    relativePath,
    setCutFiles,
    setCopyFiles,
    table,
  } = useBrowserContext();
  const [openedSheet, setOpenedSheet] = useState(false);
  const [exists, setExists] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);

  const show = copyFiles?.length || cutFiles?.length;
  const length = copyFiles?.length || cutFiles?.length;

  const copyFile = api.files.copyResourceFile.useMutation();
  const replaceFile = api.files.replaceResourceFile.useMutation();

  const handlePaste = () => {
    if (relativePath) {
      const files = cutFiles || copyFiles || [];
      const exists: string[] = [];
      const failed: string[] = [];
      const paste = async () => {
        const pastePromises = files.map((file) => {
          return new Promise<void>((resolve) => {
            copyFile.mutate(
              {
                name: resource.name,
                source: [decodeURIComponent(file)],
                destination: relativePath || [],
                cut: Boolean(cutFiles && cutFiles.length > 0),
              },
              {
                onError: (error) => {
                  if (error.data?.code === "CONFLICT") {
                    exists.push(file);
                  } else {
                    failed.push(file);
                  }
                  resolve();
                },
                onSuccess: () => {
                  resolve();
                },
              },
            );
          });
        });

        await Promise.all(pastePromises);
      };
      paste().then(() => {
        if (exists.length || failed.length) {
          setExists(exists);
          setFailed(failed);
          setOpenedSheet(true);
        }
        if (!exists.length && !failed.length) {
          toast.success("File(s) pasted");
        }
        table?.options.meta?.refresh();
        if (cutFiles) {
          setCutFiles?.(undefined);
        } else {
          setCopyFiles?.(undefined);
        }
      });
    }
  };

  const handleReplace = () => {
    if (relativePath) {
      const files = exists;
      const replace = async () => {
        for (const file of files) {
          replaceFile.mutate({
            name: resource.name,
            source: [file],
            destination: relativePath || [],
          });
        }
      };
      replace().then(() => {
        setExists([]);
        setOpenedSheet(false);
        table?.options.meta?.refresh();
        toast.success("File(s) replaced");
      });
    }
  };

  useEffect(() => {
    if (!openedSheet) {
      setExists([]);
      setFailed([]);
    }
  }, [openedSheet]);

  return (
    <>
      {show && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2"
          onClick={handlePaste}
        >
          <ClipboardPaste className="mr-1 h-4 w-4" />
          Paste ({length})
        </Button>
      )}
      <Sheet open={openedSheet} onOpenChange={setOpenedSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Error</SheetTitle>
            <SheetDescription>
              There was an error pasting the file(s).
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {exists.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">File(s) already exist</h3>
                <ul className="grid gap-2">
                  {exists.map((file) => (
                    <li
                      key={file}
                      className="bg-secondary text-secondary-foreground p-2 rounded-lg"
                    >
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {failed.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Failed to paste file(s)</h3>
                <ul className="grid gap-2">
                  {failed.map((file) => (
                    <li
                      key={file}
                      className="bg-secondary text-secondary-foreground p-2 rounded-lg"
                    >
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
            <Button onClick={handleReplace}>Replace existing</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
