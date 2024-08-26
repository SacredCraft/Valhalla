import { Dispatch, createContext, useContext } from "react";

import { ValhallaConfig } from "@sacred-craft/valhalla-config";
import {
  FileMeta,
  Render,
  Resource,
  Template,
  Version,
} from "@sacred-craft/valhalla-resource";
import { useQuery } from "@tanstack/react-query";

type FileContextType = {
  config: ValhallaConfig;
  resource: Resource;
  template: Template;
  render: Render;
  relativePath: string[];

  meta: FileMeta;

  content?: string | Buffer;
  setContent: (
    // eslint-disable-next-line no-unused-vars, no-undef
    content: string | NodeJS.ArrayBufferView,
    // eslint-disable-next-line no-unused-vars
    comment?: string,
  ) => Promise<"success" | "not-found" | "error">;

  contentCache?: string | Buffer;
  // eslint-disable-next-line no-undef
  setContentCache: Dispatch<React.SetStateAction<string | Buffer | undefined>>;

  refresh: () => void;

  refetchMeta: () => void;

  refetchContent: () => void;

  isModified: boolean;

  leftActions: React.ReactNode;
  setLeftActions: Dispatch<React.SetStateAction<React.ReactNode>>;

  rightActions: React.ReactNode;
  setRightActions: Dispatch<React.SetStateAction<React.ReactNode>>;

  headerActions: React.ReactNode;
  setHeaderActions: Dispatch<React.SetStateAction<React.ReactNode>>;

  setLocked: Dispatch<React.SetStateAction<boolean>>;
};

export const ResourceFileContext = createContext<FileContextType | null>(null);

export const ResourceFileProvider = ResourceFileContext.Provider;

export const useResourceFileContext = (): FileContextType => {
  const context = useContext(ResourceFileContext);
  if (!context) {
    throw new Error(
      "useResourceFileContext must be used within a ResourceFileProvider",
    );
  }
  return context;
};

type VersionsContextType = {
  versions: Version[];
  latestVersion?: Version;
  isLatestVersion: boolean;

  currentVersion: string | [string, string] | undefined;

  setCurrentVersion: Dispatch<
    React.SetStateAction<string | [string, string] | undefined>
  >;

  readResourceFileVersion: (
    // eslint-disable-next-line no-unused-vars
    version: string,
  ) => ReturnType<
    typeof useQuery<(Version & { content: string | Buffer }) | null, any>
  >;

  refetchVersions: () => void;
};

export const ResourceVersionsContext =
  createContext<VersionsContextType | null>(null);

export const ResourceVersionsProvider = ResourceVersionsContext.Provider;

export const useResourceVersionsContext = (): VersionsContextType => {
  const context = useContext(ResourceVersionsContext);
  if (!context) {
    throw new Error(
      "useResourceVersionsContext must be used within a ResourceVersionsProvider",
    );
  }
  return context;
};
