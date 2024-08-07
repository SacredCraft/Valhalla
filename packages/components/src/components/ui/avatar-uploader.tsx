import { useCallback } from "react";
import Dropzone, { type FileRejection } from "react-dropzone";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormDescription, FormLabel } from "@/components/ui/form";

type AvatarUploaderProps = {
  fallback?: string;
  avatar?: string;
  disabled?: boolean;
  value?: File;
  // eslint-disable-next-line no-unused-vars
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
        <Avatar className="size-16 absolute">
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
                "group relative grid size-16 cursor-pointer place-items-center rounded-full border-2 border-dashed border-muted-foreground/25 text-center transition hover:bg-muted/25",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
