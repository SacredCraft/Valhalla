import { Dispatch, createContext, useContext } from "react";

import { ValhallaConfig } from "@sacred-craft/valhalla-config";
import {
  FileMeta,
  Resource,
  Template,
  Version,
} from "@sacred-craft/valhalla-resource";

type ContextType = {
  versions: Version[];

  config: ValhallaConfig;
  resource: Resource;
  template: Template;
  relativePath: string[];

  meta: FileMeta;

  content?: string | Buffer;
  setContent: (
    // eslint-disable-next-line no-unused-vars, no-undef
    content: string | NodeJS.ArrayBufferView,
    // eslint-disable-next-line no-unused-vars
    comment?: string,
  ) => Promise<boolean>;

  contentCache?: string | Buffer;
  // eslint-disable-next-line no-undef
  setContentCache: Dispatch<React.SetStateAction<string | Buffer | undefined>>;

  refresh: () => void;

  refetchVersions: () => void;

  refetchMeta: () => void;

  refetchContent: () => void;

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
