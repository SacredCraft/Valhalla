"use client";

import { motion } from "framer-motion";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";

import { useAside } from "@/app/(main)/_components/aside";
import valhallaConfig from "@/valhalla";
import { Resource } from "@sacred-craft/valhalla-resource";

import { ResourceMenu } from "./_components/resource-menu";

export type OpenedFile = {
  name: string;
  path: string[];
  tabValue?: string;
};

type ContextType = {
  resource: Resource;
  ownedResources: string[];
  openedFiles: OpenedFile[];
  setOpenedFiles: Dispatch<SetStateAction<OpenedFile[] | undefined>>;
};

const ResourceContext = createContext<ContextType | undefined>(undefined);

export const useResourceContext = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error(
      "useResourceContext must be used within a ResourceProvider",
    );
  }
  return context;
};

type ResourceProps = React.PropsWithChildren<{
  resourceName: string;
  ownedResources: string[];
}>;

export function ResourceClientLayout({
  children,
  resourceName,
  ownedResources,
}: ResourceProps) {
  const { collapsed } = useAside();
  const [isPending, startTransition] = useTransition();
  const [resource, setResource] = useState<Resource>();
  const [openedFiles, setOpenedFiles] = useState<OpenedFile[]>();

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
}
