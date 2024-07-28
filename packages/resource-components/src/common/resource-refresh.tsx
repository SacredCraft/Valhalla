import { RotateCw } from "lucide-react";
import { useState } from "react";

import {
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
} from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/providers";

export const ResourceRefresh = (props: ButtonProps) => {
  const { isModified, refresh, setContentCache, content } =
    useResourceFileContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRefresh = () => {
    if (isModified && !isDialogOpen) {
      setIsDialogOpen(true);
      return;
    }
    refresh();
    setContentCache(content);
    setIsDialogOpen(false);
    toast.success("Refreshed successfully");
  };

  return (
    <>
      <Button
        className="h-7 px-2"
        onClick={handleRefresh}
        variant="outline"
        {...props}
      >
        <RotateCw className="mr-1 size-4" />
        Refresh
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refresh</DialogTitle>
            <DialogDescription>
              Are you sure you want to refresh the file? All unsaved changes
              will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleRefresh}>Refresh</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
