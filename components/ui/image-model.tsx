"use client";

import Image from "next/image";

import { useEffect, useMemo, useState, useTransition } from "react";

import { getFileContent } from "@/app/actions";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type ImageModelProps = {
  children: React.ReactNode;
  src: string;
};

export function ImageModel({ children, src }: ImageModelProps) {
  const [file, setFile] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const fileExt = src.split(".").pop();

  const content = useMemo(
    () => `data:image/${fileExt};base64,${file}` || src,
    [file, fileExt, src],
  );

  useEffect(() => {
    startTransition(() => {
      getFileContent(src, "base64").then((content) => {
        setFile(content);
      });
    });
  }, [src, startTransition]);

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
