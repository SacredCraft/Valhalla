"use client";

import { SaveIcon } from "lucide-react";
import React from "react";

import { useFilesEditorContext } from "@/app/(main)/plugins/[plugin]/files/editor/[...path]/layout.client";
import { Button } from "@/app/_components/ui/button";

export const ActionSave = () => {
  const { modified } = useFilesEditorContext();

  return (
    <Button className="h-7 px-2" disabled={!modified} type="submit">
      <SaveIcon className="mr-1 h-4 w-4" />
      Save
    </Button>
  );
};
