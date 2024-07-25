import { SaveIcon } from "lucide-react";

import { Button, ButtonProps, toast } from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/layout";

export const ResourceSave = (props: ButtonProps) => {
  const { isModified, setContent, contentCache } = useResourceFileContext();

  const handleSave = () => {
    setContent(contentCache || "");
    toast.success("Saved successfully");
  };

  return (
    <Button
      className="h-7 px-2"
      disabled={!isModified}
      onClick={handleSave}
      {...props}
    >
      <SaveIcon className="mr-1 size-4" />
      Save
    </Button>
  );
};
