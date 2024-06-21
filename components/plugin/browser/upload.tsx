"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useBrowserContext } from "@/app/(main)/plugins/[plugin]/browser/layout.client";
import { usePluginContext } from "@/app/(main)/plugins/[plugin]/layout.client";
import { UploadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function generateDataUrl(file: File, callback: (imageUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result as string);
  reader.readAsDataURL(file);
}

export function Upload() {
  const { plugin } = usePluginContext();
  const { relativePath, table } = useBrowserContext();

  const [files, setFiles] = useState<File[]>([]);

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("pluginId", plugin.id);
    formData.append("relativePath", relativePath?.join("/") || "");
    files.forEach((file) => {
      formData.append("files", file);
    });

    fetch("/api/files", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          return res;
        }
        return Promise.reject("Failed to upload file");
      })
      .then(() => {
        table?.options.meta?.refresh();
        toast.success("File uploaded successfully");
      })
      .catch(() => {
        toast.error("Failed to upload file");
      });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <UploadIcon className="mr-1 h-4 w-4" />
          Upload
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Upload File</SheetTitle>
          <SheetDescription>
            Upload a file to the current directory.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4 h-fit">
          <FileUploader value={files} onValueChange={setFiles} multiple />
        </div>
        <SheetFooter>
          <SheetClose>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose>
            <Button onClick={() => handleUpload()}>Upload</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
