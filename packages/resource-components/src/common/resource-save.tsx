import { SaveIcon } from "lucide-react";

import { Button, toast } from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/layout";

export const ResourceSave = () => {
  const { isModified, setContent, contentCache } = useResourceFileContext();

  const handleSave = () => {
    setContent(contentCache);
    toast.success("Saved successfully");
  };

  return (
    <Button className="h-7 px-2" disabled={!isModified} onClick={handleSave}>
      <SaveIcon className="mr-1 size-4" />
      Save
    </Button>
  );
};
