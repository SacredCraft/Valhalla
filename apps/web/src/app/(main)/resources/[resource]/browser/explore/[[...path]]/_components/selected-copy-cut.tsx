"use client";

import { ClipboardPaste } from "lucide-react";
import { useMemo } from "react";

import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@sacred-craft/valhalla-components";

import { useBrowserContext } from "../../../layout.client";
import { useExploreContext } from "../layout.client";

export function SelectedCopyCut() {
  const { rowSelection, data, setRowSelection } = useExploreContext();

  const { setCutFiles, setCopyFiles } = useBrowserContext();

  const selectedRows = useMemo(
    () => Object.keys(rowSelection).map((index) => data[parseInt(index, 10)]),
    [rowSelection, data],
  );

  const handleCopy = () => {
    const files = selectedRows
      .map((row) => row?.path.join("/"))
      .filter((path) => path !== undefined);
    setCutFiles([]);
    setCopyFiles(files);
    setRowSelection({});
  };

  const handleCut = () => {
    const files = selectedRows
      .map((row) => row?.path.join("/"))
      .filter((path) => path !== undefined);
    setCopyFiles([]);
    setCutFiles(files);
    setRowSelection({});
  };

  const length = useMemo(
    () => Object.keys(rowSelection).length,
    [rowSelection],
  );

  if (length === 0) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <ClipboardPaste className="mr-1 h-4 w-4" />
          Copy/Cut Selected({length})
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Copy/Cut files</SheetTitle>
          <SheetDescription>
            Please select an action to perform.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="mt-2">
          <SheetClose asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button size="sm" onClick={handleCut}>
            Cut
          </Button>
          <Button size="sm" onClick={handleCopy}>
            Copy
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
