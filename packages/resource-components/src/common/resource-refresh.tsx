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
  DialogTrigger,
  toast,
} from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/layout";

export const ResourceRefresh = (props: ButtonProps) => {
  const { isModified, refresh } = useResourceFileContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRefresh = () => {
    if (isModified && !isDialogOpen) {
      setIsDialogOpen(true);
      return;
    }
    if (!isModified) {
      refresh();
      toast.success("File refreshed successfully");
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-7 px-2"
          onClick={handleRefresh}
          variant="outline"
          {...props}
        >
          <RotateCw className="mr-1 size-4" />
          Refresh
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refresh</DialogTitle>
          <DialogDescription>
            Are you sure you want to refresh the file? All unsaved changes will
            be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setIsDialogOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={refresh}>Refresh</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
