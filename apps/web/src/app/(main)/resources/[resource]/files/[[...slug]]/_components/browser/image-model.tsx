"use client";

import Image from "next/image";
import { useMemo } from "react";

import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@sacred-craft/valhalla-components";

import { useResourceContext } from "../../layout.client";

type ImageModelProps = {
  children: React.ReactNode;
  src: string;
};

export function ImageModel({ children, src }: ImageModelProps) {
  const { resource } = useResourceContext();
  const { data, isPending } = api.files.readResourceFile.useQuery({
    resource: resource.name,
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
