"use client";

import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import path from "path";
import React, { useEffect, useState, useTransition } from "react";

import { useEditorContext } from "@/app/[plugin]/editor/[...path]/page.client";
import { File, getFile } from "@/app/actions";
import { ConfigurationResult } from "@/lib/core";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

type InfoProps = {
  actions?: React.ReactNode;
};

export function Info({ actions }: InfoProps) {
  const [file, setFile] = useState<(File & { ext?: string }) | null>(null);
  const [isPending, startTransition] = useTransition();
  const { collapsed, relations, pluginPath, pluginId, filePath } =
    useEditorContext();

  useEffect(() => {
    if (pluginPath && filePath) {
      startTransition(() => {
        getFile(
          pluginPath,
          filePath.map((i) => decodeURIComponent(i)).join("/"),
        ).then((file) => setFile(file));
      });
    }
  }, [pluginPath, filePath]);

  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          className="w-full space-y-4 md:w-[20rem]"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: { opacity: 0, x: "100%" },
            visible: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.2 }}
        >
          <Accordion type="multiple" className="space-y-4">
            <AccordionItem value="info" asChild>
              <Card>
                {!isPending && file ? (
                  <CardContent className="grid p-0 text-sm">
                    <AccordionTrigger icon>
                      <div className="flex items-center gap-4 space-x-2 text-start">
                        <div className="flex aspect-square w-12 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                          <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {file.path.join("/")}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 px-3">
                      <div className="flex items-center justify-between">
                        <div className="text-gray-500 dark:text-gray-400">
                          File Size
                        </div>
                        <div>
                          {file.size > 1024 * 1024
                            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                            : file.size > 1024
                              ? `${(file.size / 1024).toFixed(2)} KB`
                              : `${file.size} B`}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-500 dark:text-gray-400">
                          Created At
                        </div>
                        <div>{file.createdAt}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-500 dark:text-gray-400">
                          Last Modified
                        </div>
                        <div>{file.updatedAt}</div>
                      </div>
                    </AccordionContent>
                  </CardContent>
                ) : (
                  <CardContent className="grid py-6 text-base">
                    Loading...
                  </CardContent>
                )}
              </Card>
            </AccordionItem>

            <AccordionItem value="actions" asChild>
              <Card>
                <CardContent className="p-0">
                  <AccordionTrigger icon>
                    <div className="flex flex-col items-start space-y-1.5 text-start">
                      <CardTitle>Actions</CardTitle>
                      <CardDescription>
                        List of actions that can be performed on this file
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3">
                    {actions}
                  </AccordionContent>
                </CardContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="versions" asChild>
              <Card>
                <CardContent className="p-0">
                  <AccordionTrigger icon>
                    <div className="flex flex-col items-start space-y-1.5 text-start">
                      <CardTitle>Versions</CardTitle>
                      <CardDescription>
                        List of versions of this file
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-3">
                    <Version
                      version="1.0.0"
                      description="Initial version of the file"
                    />
                    <Version version="1.1.0" description="Added new feature" />
                  </AccordionContent>
                </CardContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="relations" asChild>
              <Card>
                <CardContent className="p-0">
                  <AccordionTrigger icon>
                    <div className="flex flex-col items-start space-y-1.5 text-start">
                      <CardTitle>Relations Files</CardTitle>
                      <CardDescription>
                        List of relations of this file
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3">
                    {pluginId &&
                      relations?.map((r) => (
                        <RelationFile
                          pluginId={pluginId}
                          key={r.path.join("/")}
                          {...r}
                        />
                      ))}
                  </AccordionContent>
                </CardContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RelationFile({
  path: filePath,
  name,
  pluginId,
}: ConfigurationResult & { pluginId: string }) {
  return (
    <Link
      href={"/" + path.join(pluginId, "editor", ...filePath.slice(1))}
      className="space-y-1 rounded-lg bg-gray-100 p-2 dark:bg-gray-800 flex flex-col"
    >
      <h1 className="font-medium">{name}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filePath.slice(1).join("/")}
      </p>
    </Link>
  );
}

function Version({
  version,
  description,
}: {
  version: string;
  description: string;
}) {
  return (
    <div className="space-y-1 rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
      <h1 className="font-medium">{version}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
