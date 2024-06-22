import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import React, { useCallback, useState } from "react";
import Dropzone, { type FileRejection } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useProfile } from "@/app/(main)/layout.client";
import { cn } from "@/lib/utils";
import { updateUserById } from "@/service/user";
import { zodResolver } from "@hookform/resolvers/zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ProfileModel() {
  const [tab, setTab] = useState<string>("information");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Profile
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[500px]">
        <div className="flex gap-4">
          <aside className="flex flex-col items-center w-48 gap-2">
            <Item
              value="information"
              label="Information"
              tab={tab}
              setTab={setTab}
            />
            <Item value="other" label="Other" tab={tab} setTab={setTab} />
          </aside>
          <div className="w-full">
            {tab === "information" && <Information />}
            {tab === "other" && <div />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  password: z
    .string()
    .optional()
    .refine((val) => val === "" || (val !== undefined && val.length >= 8), {
      message: "Password must be at least 8 characters long if provided",
    }),
});

function Information() {
  const { username, avatar, id } = useProfile();
  const [file, setFile] = useState<File>();
  const [updating, setUpdating] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });
  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setUpdating(true);
    const data: any = {
      password: values.password === "" ? undefined : values.password,
    };
    const update = () => {
      updateUserById(id, data).then((res) => {
        if (res) {
          toast.success("Profile updated");
          if (data.password) {
            signOut().then((r) => {
              toast.success("Password updated, please sign in again");
            });
          }
          router.refresh();
        } else {
          toast.error("Profile update failed");
        }
        setUpdating(false);
      });
    };
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        data.avatar = reader.result;
        update();
      };
    } else {
      update();
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      const updatedFiles = file ? [file, ...newFiles] : newFiles;

      setFile(updatedFiles[0]);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }
    },

    [file, setFile],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 h-full"
      >
        <DialogHeader>
          <DialogTitle>Information</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <FormLabel>Avatar</FormLabel>
            <div className="relative flex flex-col gap-2">
              <Avatar className="size-16 absolute">
                <AvatarImage
                  src={file ? URL.createObjectURL(file) : avatar ?? ""}
                  alt={username}
                />
                <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <Dropzone
                onDrop={onDrop}
                multiple={false}
                accept={{ "image/*": [] }}
                disabled={updating}
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
              <FormDescription>
                Click or drag to upload a new avatar
              </FormDescription>
            </div>
          </div>
          <Input className="hidden" name="username" autoComplete="username" />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={updating}
                    placeholder="new password"
                    type="password"
                    autoComplete="new-password"
                    aria-label="new password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Password must be more than 8 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="mt-auto">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function Item({
  value,
  label,
  tab,
  setTab,
}: {
  value: string;
  label: string;
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Button
      size="sm"
      variant={tab === value ? "secondary" : "ghost"}
      onClick={() => setTab(value)}
      className="w-full h-7"
    >
      {label}
    </Button>
  );
}
