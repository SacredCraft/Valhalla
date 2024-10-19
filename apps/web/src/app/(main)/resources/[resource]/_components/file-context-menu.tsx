import React from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
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
    setOpenedFiles(
      openedFiles.filter((file) => file.path.join("/") !== path.join("/")),
    );
  };

  const handleCloseOthers = () => {
    setOpenedFiles(
      openedFiles.filter((file) => file.path.join("/") === path.join("/")),
    );
  };

  const handleCloseAll = () => {
    setOpenedFiles([]);
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
