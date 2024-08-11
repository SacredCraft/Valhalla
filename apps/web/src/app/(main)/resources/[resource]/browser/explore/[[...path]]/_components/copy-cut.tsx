"use client";

import { ClipboardPaste } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { FileCol } from "@/app/(main)/resources/[resource]/browser/explore/[[...path]]/_components/files-table-columns";
import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { api } from "@/trpc/react";
import {
  Button,
  DropdownMenuItem,
  DropdownMenuShortcut,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  toast,
} from "@sacred-craft/valhalla-components";
import { Row } from "@tanstack/react-table";

import { useBrowserContext } from "../../../layout.client";
import { useExploreContext } from "../layout.client";

interface CopyCutRowActionProps {
  row: Row<FileCol>;
}

export function CopyCutRowAction({ row }: CopyCutRowActionProps) {
  const { setCopyFiles, setCutFiles } = useBrowserContext();

  const copy = () => {
    setCutFiles([]);
    setCopyFiles([row.original.path.join("/")]);
  };

  const cut = () => {
    setCopyFiles([]);
    setCutFiles([row.original.path.join("/")]);
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
  const { relativePath, rowSelection } = useExploreContext();
  const { setCutFiles, setCopyFiles, copyFiles, cutFiles } =
    useBrowserContext();
  const [openedSheet, setOpenedSheet] = useState(false);
  const [exists, setExists] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);

  const show = copyFiles.length !== 0 || cutFiles.length !== 0;
  const length = copyFiles.length + cutFiles.length;

  const copyFile = api.files.copyResourceFile.useMutation();
  const replaceFile = api.files.replaceResourceFile.useMutation();

  const router = useRouter();

  const lengthRowSelection = useMemo(
    () => Object.keys(rowSelection).length,
    [rowSelection],
  );

  const handlePaste = () => {
    if (relativePath) {
      const files = cutFiles.length > 0 ? cutFiles : copyFiles;
      const exists: string[] = [];
      const failed: string[] = [];

      const pasteFile = async (file: string) => {
        return new Promise<void>((resolve) => {
          copyFile.mutate(
            {
              resource: resource.name,
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
              },
              onSettled: () => {
                resolve();
              },
            },
          );
        });
      };

      const paste = async () => {
        const promises = files.map((file) => pasteFile(file));
        await Promise.all(promises);
      };

      paste().then(() => {
        if (exists.length || failed.length) {
          setExists(exists);
          setFailed(failed);
          setOpenedSheet(true);
        }
        if (!exists.length && !failed.length) {
          toast.success("File(s) pasted");
        } else {
          toast.error("Failed to paste file(s)");
        }
        router.refresh();
        if (cutFiles.length > 0) {
          setCutFiles([]);
        } else {
          setCopyFiles([]);
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
            resource: resource.name,
            source: [file],
            destination: relativePath || [],
          });
        }
      };
      replace().then(() => {
        setExists([]);
        setOpenedSheet(false);
        router.refresh();
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

  if (lengthRowSelection > 0) {
    return null;
  }

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
          <SheetFooter className="mt-2">
            <SheetClose asChild>
              <Button variant="outline" size="sm">
                Close
              </Button>
            </SheetClose>
            <Button onClick={handleReplace} size="sm">
              Replace existing
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
