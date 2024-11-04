import { RefreshCcw } from "lucide-react";

import { Button, ButtonProps, toast } from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/providers";

export const ResourceReset = (props: ButtonProps) => {
  const { isModified, setContentCache, content } = useResourceFileContext();

  const handleReset = async () => {
    setContentCache(content || "");
    toast.success("Reset successfully");
  };

  return (
    <Button
      className="h-7 px-2"
      disabled={!isModified}
      onClick={() => handleReset()}
      {...props}
    >
      <RefreshCcw className="mr-1 size-4" />
      Reset
    </Button>
  );
};
