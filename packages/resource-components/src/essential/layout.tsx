import { Dispatch, createContext, useContext } from "react";

import { FileMeta, Resource, Template } from "@sacred-craft/valhalla-resource";

type ContextType = {
  resource: Resource;
  template: Template;
  relativePath: string[];

  meta: FileMeta;

  content: string | Buffer;
  // eslint-disable-next-line no-unused-vars, no-undef
  setContent: (content: string | NodeJS.ArrayBufferView) => void;

  contentCache: string | Buffer;
  // eslint-disable-next-line no-undef
  setContentCache: Dispatch<React.SetStateAction<string | Buffer>>;

  isModified: boolean;

  leftActions: React.ReactNode;
  setLeftActions: Dispatch<React.SetStateAction<React.ReactNode>>;

  rightActions: React.ReactNode;
  setRightActions: Dispatch<React.SetStateAction<React.ReactNode>>;

  [key: string]: any;
};

export const ResourceFileContext = createContext<ContextType | null>(null);

export const ResourceFileProvider = ResourceFileContext.Provider;

export const useResourceFileContext = (): ContextType => {
  const context = useContext(ResourceFileContext);
  if (!context) {
    throw new Error(
      "useResourceFileContext must be used within a ResourceFileProvider",
    );
  }
  return context;
};
