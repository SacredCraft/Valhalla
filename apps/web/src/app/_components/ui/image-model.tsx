"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";

import { usePluginContext } from "@/app/(main)/plugins/[plugin]/layout.client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { getFileContent } from "@/app/actions";
import { api } from "@/trpc/react";

type ImageModelProps = {
  children: React.ReactNode;
  src: string;
};

export function ImageModel({ children, src }: ImageModelProps) {
  const { plugin } = usePluginContext();
  const { data, isPending } = api.files.readPluginFile.useQuery({
    id: plugin.id,
    relativePath: src.split("/"),
    options: "base64",
  });
  const fileExt = src.split(".").pop();

  const content = useMemo(
    () => `data:image/${fileExt};base64,${data}` || src,
    [data, fileExt, src],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="p-0"
        closeClassName="bg-accent p-1 transition-all"
      >
        {isPending ? (
          <div>Loading...</div>
        ) : (
          <Image
            src={content}
            alt="Image Preview"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
