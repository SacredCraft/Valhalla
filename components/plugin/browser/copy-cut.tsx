"use client";

import { ClipboardPaste } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { copyFile, replaceFile } from "@/app/actions";
import { useBrowserContext } from "@/app/plugins/[plugin]/browser/layout.client";
import { usePluginContext } from "@/app/plugins/[plugin]/layout.client";
import { Row, Table } from "@tanstack/react-table";

import { FileCol } from "@/components/plugin/browser/files-table-columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
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
  const { plugin } = usePluginContext();
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

  const paste = () => {
    if (relativePath) {
      let exists: string[] = [];
      let failed: string[] = [];
      const files = cutFiles || copyFiles || [];
      const copyAll = async () => {
        for (const file of files) {
          const result = await copyFile(
            plugin.id,
            decodeURIComponent(file),
            relativePath.join("/"),
            cutFiles ? cutFiles.length > 0 : false,
          );
          if (result === "exist") {
            exists.push(file);
          } else if (!result) {
            failed.push(file);
          }
        }
      };
      copyAll().then(() => {
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
    let success = true;
    if (relativePath) {
      for (const exist of exists) {
        replaceFile(
          plugin.id,
          decodeURIComponent(exist),
          relativePath.join("/"),
        ).then((result) => {
          if (!result) {
            success = false;
          }
        });
      }
    }
    if (success) {
      toast.success("File(s) replaced");
      setExists([]);
      setOpenedSheet(false);
    } else {
      toast.error("Failed to replace file(s)");
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
          onClick={paste}
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
