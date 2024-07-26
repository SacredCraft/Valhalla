import { MessageSquareText, SaveIcon } from "lucide-react";
import { useState } from "react";

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
  Textarea,
  cn,
  toast,
} from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/layout";

export const ResourceSave = (props: ButtonProps) => {
  const { isModified, setContent, contentCache, config } =
    useResourceFileContext();

  const [comment, setComment] = useState<string | undefined>();

  const handleSave = async (comment?: string) => {
    const success = await setContent(contentCache || "", comment);

    if (!success) {
      return;
    }
    setComment(undefined);
    toast.success("Saved successfully");
  };

  return (
    <div className="flex">
      <Button
        className={cn("h-7 px-2", config.enableComments && "rounded-r-none")}
        disabled={!isModified}
        onClick={() => handleSave()}
        {...props}
      >
        <SaveIcon className="mr-1 size-4" />
        Save
      </Button>
      {config.enableComments && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="h-7 px-1.5 rounded-l-none border-l"
              disabled={!isModified}
              {...props}
            >
              <MessageSquareText className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save</DialogTitle>
              <DialogDescription>
                You can add a comment before saving the file.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={() => handleSave(comment)}>Save</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
