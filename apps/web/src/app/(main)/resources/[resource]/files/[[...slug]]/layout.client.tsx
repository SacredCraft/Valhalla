"use client";

import { motion } from "framer-motion";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";

import { useAside } from "@/app/(main)/_components/aside";
import valhallaConfig from "@/config";
import { Resource } from "@sacred-craft/valhalla-resource";

import { ResourceMenu } from "../../_components/resource-menu";

type ResourceProviderProps = React.PropsWithChildren<{
  resource: string;
  ownedResources: string[];
}>;

export type OpenedFile = {
  name: string;
  path: string[];
  tabValue?: string;
};

export const RelativePathContext = createContext<string[] | undefined>(
  undefined,
);

export const useRelativePath = () => {
  const context = useContext(RelativePathContext);
  if (!context) {
    throw new Error(
      "useRelativePath must be used within a RelativePathProvider",
    );
  }
  return context;
};

export const ResourceContext = createContext<
  | {
      resource: Resource;
      ownedResources: string[];
      openedFiles: OpenedFile[];
      setOpenedFiles: Dispatch<SetStateAction<OpenedFile[] | undefined>>;
    }
  | undefined
>(undefined);

export const ResourceProvider = ({
  children,
  resource: resourceName,
  ownedResources,
}: ResourceProviderProps) => {
  const { collapsed } = useAside();
  const [isPending, startTransition] = useTransition();
  const [openedFiles, setOpenedFiles] = useState<OpenedFile[]>();
  const [resource, setResource] = useState<Resource>();

  useEffect(() => {
    startTransition(() => {
      setResource(
        valhallaConfig.resources.find((r) => r.name === resourceName),
      );
    });
  }, [resourceName]);

  useEffect(() => {
    if (!openedFiles) {
      const cache = JSON.parse(
        localStorage.getItem(`${resourceName}-opened-files`) || "[]",
      );
      setOpenedFiles(cache);
    }
  }, [openedFiles, resourceName]);

  useEffect(() => {
    if (openedFiles) {
      localStorage.setItem(
        `${resourceName}-opened-files`,
        JSON.stringify(openedFiles),
      );
    }
  }, [openedFiles, resourceName]);

  if (isPending || !resource) {
    return null;
  }

  if (!openedFiles) {
    return null;
  }

  return (
    <ResourceContext.Provider
      value={{ openedFiles, setOpenedFiles, resource, ownedResources }}
    >
      <ResourceMenu ownedResources={ownedResources} />
      <motion.div
        className="flex-1 ml-[calc(var(--aside-width)+220px)]"
        layout
        layoutDependency={collapsed}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </ResourceContext.Provider>
  );
};

export const useResourceContext = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error(
      "useResourceContext must be used within a ResourceProvider",
    );
  }
  return context;
};
