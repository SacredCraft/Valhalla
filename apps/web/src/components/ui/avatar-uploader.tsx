import React, { useCallback } from "react";
import Dropzone, { type FileRejection } from "react-dropzone";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@//components/ui/avatar";
import { FormDescription, FormLabel } from "@//components/ui/form";
import { cn } from "@/lib/utils";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

type AvatarUploaderProps = {
  fallback?: string;
  avatar?: string;
  disabled?: boolean;
  value?: File;
  onChange?: (file: File) => void;
};

export const AvatarUploader = ({
  fallback,
  avatar,
  disabled,
  value: valueProp,
  onChange: onValueChange,
}: AvatarUploaderProps) => {
  const [file, setFile] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      setFile(newFiles[0]);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }
    },

    [setFile],
  );

  return (
    <div className="flex flex-col gap-2">
      <FormLabel>Avatar</FormLabel>
      <div className="relative flex flex-col gap-2">
        <Avatar className="absolute size-16">
          <AvatarImage
            src={file ? URL.createObjectURL(file) : (avatar ?? "")}
            alt={fallback}
          />
          <AvatarFallback>{fallback?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <Dropzone
          onDrop={onDrop}
          multiple={false}
          accept={{ "image/*": [] }}
          disabled={disabled}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                "border-muted-foreground/25 hover:bg-muted/25 group relative grid size-16 cursor-pointer place-items-center rounded-full border-2 border-dashed text-center transition",
                "ring-offset-background focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isDragActive && "border-muted-foreground/50",
              )}
            >
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
        <FormDescription>Click or drag to upload a new avatar</FormDescription>
      </div>
    </div>
  );
};
