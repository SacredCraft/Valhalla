import { RefreshCcw } from "lucide-react";

import {
  Button,
  ButtonProps,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  toast,
} from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/providers";

export const ResourceReset = (props: ButtonProps) => {
  const { isModified, setContentCache, content } = useResourceFileContext();

  const handleReset = async () => {
    setContentCache(content || "");
    toast.success("Reset successfully");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-7 px-2" disabled={!isModified} {...props}>
          <RefreshCcw className="mr-1 size-4" />
          Reset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset</DialogTitle>
          <DialogDescription>
            Are you sure you want to reset the file?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => handleReset()}>Reset</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
