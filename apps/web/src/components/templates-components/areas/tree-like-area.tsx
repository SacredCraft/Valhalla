"use client";

import React, { Fragment, createContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useFilesEditorContext } from "@/app/(main)/plugins/[plugin]/files/editor/[...path]/layout.client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/app/_components/ui/breadcrumb";
import { Button, ButtonProps } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { cn } from "@/lib/utils";

import { Node } from "@/components/templates-components/form/node";
import { useNode } from "@/components/templates-components/form/node";

export type TreeLikePath = {
  label: string;
  value: string;
  parent?: TreeLikePath;
};

type ContextType = {
  depth: number;

  path: TreeLikePath[];
  setPath: (path: TreeLikePath[]) => void;

  labelKeys?: string[];
  treeKeys?: { label?: string; value: string }[];

  currentNodes: any[];
  setCurrentNodes: (nodes: any[]) => void;
};

const TreeLikeAreaContext = createContext<ContextType | undefined>(undefined);

export const useTreeLikeArea = () => {
  const context = React.useContext(TreeLikeAreaContext);
  if (!context) {
    throw new Error("useTreeLikeArea must be used within a TreeLikeArea");
  }
  return context;
};

export const TreeLikeAreaProvider = ({
  children,
  labelKeys,
  treeKeys,
  depth = 0,
}: {
  children: React.ReactNode;
  labelKeys?: string[];
  treeKeys?: { label?: string; value: string }[];
  depth?: number;
}) => {
  const [currentPath, setCurrentPath] = useState<TreeLikePath[]>([]);
  const [currentNodes, setCurrentNodes] = useState<any[]>([]);

  return (
    <TreeLikeAreaContext.Provider
      value={{
        depth,
        path: currentPath,
        setPath: setCurrentPath,
        labelKeys,
        treeKeys,
        currentNodes,
        setCurrentNodes,
      }}
    >
      {children}
    </TreeLikeAreaContext.Provider>
  );
};

type TreeLikeAreaProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<ContextType, "path" | "setPath" | "currentNodes" | "setCurrentNodes">;

export const TreeLikeArea = ({
  children,
  className,
  ...props
}: TreeLikeAreaProps) => {
  return (
    <TreeLikeAreaProvider {...props}>
      <div className={cn("flex space-x-2", className)}>{children}</div>
    </TreeLikeAreaProvider>
  );
};

export const TreeLikeAreaAside = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex flex-col space-y-2">{children}</div>;
};

type TreeLikeAreaNodesProps = {
  classNames?: {
    scrollArea?: string;
    nodes?: string;
  };
};

export const TreeLikeAreaNodes = ({ classNames }: TreeLikeAreaNodesProps) => {
  const { form } = useFilesEditorContext();
  const { node } = useNode();
  const { path, treeKeys, labelKeys, setCurrentNodes, currentNodes } =
    useTreeLikeArea();

  if (!node) {
    throw new Error("TreeLikeAreaProvider must be used within a Node");
  }

  useEffect(
    () => {
      let currentNodes: any[] = [];
      if (path.length === 0) {
        const values = (form.watch(node) as unknown as any[]).map((n, i) => ({
          ...n,
          _path: i,
        }));
        currentNodes.push(...values);
      } else {
        if (!treeKeys) {
          return;
        }
        treeKeys?.forEach(({ label, value }) => {
          const nodePath = path
            .map((p) => p.value)
            .join(".")
            .concat(`.${value}`);
          const values = (
            form.watch(node.concat(`.${nodePath}`)) as unknown as
              | any[]
              | undefined
          )?.map((n) => ({
            ...n,
            _group: label,
            _path: nodePath,
          }));
          if (values) {
            currentNodes.push(...values);
          }
        });
      }
      setCurrentNodes(
        currentNodes.sort((a, b) => {
          if (a._group && b._group) {
            return a._group.localeCompare(b._group);
          }
          return 0;
        }),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.formState, node, path, treeKeys],
  );

  const getValue = (obj: any, keys: string[]) => {
    for (const key of keys) {
      if (obj[key] !== undefined) {
        return obj[key];
      }
    }
  };

  return (
    <ScrollArea className={cn("w-56", classNames?.scrollArea)}>
      <div className={cn("gap-y-2 flex flex-col size-full", classNames?.nodes)}>
        {currentNodes.map((n, i) => {
          const isGroupFirst =
            i === 0 || n._group !== currentNodes[i - 1]._group;
          return (
            <Fragment key={i}>
              {isGroupFirst && n._group && (
                <Label className="text-xs text-gray-500 px-2">{n._group}</Label>
              )}
              <TreeLikeAreaNode
                key={i}
                path={{
                  label: getValue(n, labelKeys ?? []),
                  value: n._path,
                  parent: path[path.length - 1] ?? undefined,
                }}
              >
                {n._path}
              </TreeLikeAreaNode>
            </Fragment>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export const TreeLikeAreaNode = ({
  children,
  className,
  path,
}: {
  children: React.ReactNode;
  className?: string;
  path: TreeLikePath;
}) => {
  const { setPath, path: currentPath } = useTreeLikeArea();

  return (
    <button
      className={cn(
        "flex items-center space-x-2 bg-zinc-100 p-2 rounded-md hover:bg-zinc-200 transition-colors",
        className,
      )}
      onClick={() => setPath([...currentPath, path])}
    >
      <span className="text-sm font-semibold">{path.label ?? children}</span>
    </button>
  );
};

export const TreeLikeAreaBackButton = ({ children, ...props }: ButtonProps) => {
  const { path, setPath } = useTreeLikeArea();

  return (
    <Button
      onClick={() => setPath(path.slice(0, -1))}
      {...props}
      disabled={path.length === 0}
    >
      {children}
    </Button>
  );
};

export const TreeLikeAreaAsideHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex", className)}>{children}</div>;
};

export const TreeLikeAreaContent = ({
  children,
  className,
}: {
  children: (path: TreeLikePath[]) => React.ReactNode;
  className?: string;
}) => {
  const { path } = useTreeLikeArea();

  const renderNodes = (index = 0) => {
    if (path.length === 0) return children(path);
    if (index >= path.length) return null;

    const node = path[index]!!;

    return (
      <Node node={node.value} key={node.value}>
        {renderNodes(index + 1)}
        {index === path.length - 1 && children(path)}
      </Node>
    );
  };

  return (
    <div className={cn("flex-1 space-y-2", className)}>{renderNodes()}</div>
  );
};

export const TreeLikeAreaAsideFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex", className)}>{children}</div>;
};

export const TreeLikeAreaCreateSheet = () => {
  const { node } = useNode();
  const { form } = useFilesEditorContext();
  const { path, depth } = useTreeLikeArea();
  const [type, setType] = useState<string>("");
  const [values, setValues] = useState<any>({});

  if (!form || !node) {
    throw new Error(
      "TreeLikeAreaCreateSheet must be used within a Node inside a Form",
    );
  }

  const onSubmit = (values: any) => {
    if (path.length === 0) {
      form.setValue(node.concat(path.join(".")), [
        ...(form.watch(node) ?? []),
        values,
      ]);
    } else {
      const nodePath = node.concat(
        `.${path.map((p) => p.value).join(".")}.${type}.mech`,
      );
      form.setValue(nodePath, [...(form.watch(nodePath) ?? []), values]);
    }
  };

  if (path.length + 1 > depth) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">New</Button>
      </SheetTrigger>
      <SheetContent>
        <form className="space-y-4">
          <SheetHeader>
            <SheetTitle>Create Mechanism</SheetTitle>
            <SheetDescription>
              Create a new mechanism for the item.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-2">
            {path.length !== 0 && (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={(value) => setType(value)} value={type}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="processor">Processor</SelectItem>
                    <SelectItem value="prepare">Prepare</SelectItem>
                    <SelectItem value="trigger">Trigger</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The type of the mechanism.</FormDescription>
              </FormItem>
            )}
            <FormItem>
              <FormLabel>==</FormLabel>
              <FormControl>
                <Input
                  value={values["=="]}
                  onChange={(e) => setValues({ "==": e })}
                />
              </FormControl>
              <FormDescription>The ID of the mechanism.</FormDescription>
            </FormItem>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={() => onSubmit(values)}>Create</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export const TreeLikeAreaContentActions = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex", className)}>{children}</div>;
};

export const TreeLikeAreaContentHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex px-2 bg-zinc-100 rounded-md", className)}>
      {children}
    </div>
  );
};

export const TreeLikeAreaContentBreadcrumb = ({
  className,
}: {
  className?: string;
}) => {
  const { path, setPath } = useTreeLikeArea();

  return (
    <div className={cn("flex h-8 items-center", className)}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem
            className="cursor-pointer"
            onClick={() => setPath([])}
          >
            Root
          </BreadcrumbItem>
          {path.map((p, i) => (
            <Fragment key={i}>
              {i === 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem
                className="cursor-pointer"
                onClick={() => setPath(path.slice(0, i + 1))}
              >
                {p.label}
              </BreadcrumbItem>
              {i < path.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
