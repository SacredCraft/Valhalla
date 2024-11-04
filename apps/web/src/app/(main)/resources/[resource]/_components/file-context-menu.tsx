import React from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  toast,
} from "@sacred-craft/valhalla-components";

import { useResourceContext } from "../files/[[...slug]]/layout.client";

export const FileContextMenu = ({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string[];
}) => {
  const { openedFiles, setOpenedFiles } = useResourceContext();

  const handleClose = () => {
    if (
      openedFiles.find((file) => file.path.join("/") === path.join("/"))
        ?.isModified
    ) {
      toast.error("Please save the file before closing it.");
    } else {
      setOpenedFiles(
        openedFiles.filter((file) => file.path.join("/") !== path.join("/")),
      );
    }
  };

  const handleCloseOthers = () => {
    if (
      openedFiles
        .filter((file) => file.path.join("/") !== path.join("/"))
        .some((file) => file.isModified)
    ) {
      toast.error("Please save the files before closing them.");
    } else {
      setOpenedFiles(
        openedFiles.filter((file) => file.path.join("/") === path.join("/")),
      );
    }
  };

  const handleCloseAll = () => {
    if (openedFiles.some((file) => file.isModified)) {
      toast.error("Please save the files before closing them.");
    } else {
      setOpenedFiles([]);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem onClick={handleClose}>Close</ContextMenuItem>
        <ContextMenuItem onClick={handleCloseOthers}>
          Close Others
        </ContextMenuItem>
        <ContextMenuItem onClick={handleCloseAll}>Close All</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
