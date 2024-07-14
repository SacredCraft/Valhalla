import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useProfile } from "@/app/(main)/layout.client";
import { AvatarUploader } from "@/app/_components/ui/avatar-uploader";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { DropdownMenuItem } from "@/app/_components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";

export function ProfileModel() {
  const [tab, setTab] = useState<string>("information");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Profile
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <div className="flex gap-4 h-[480px]">
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
  bio: z.string().optional(),
});

function Information() {
  const { username, avatar, id, bio } = useProfile();
  const [file, setFile] = useState<File>();
  const [updating, setUpdating] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      bio: bio ?? undefined,
    },
  });
  const router = useRouter();

  const updateUserById = api.users.updateUserById.useMutation({
    onSuccess: (data) => {
      toast.success("Profile updated");
      if (data.password) {
        signOut().then((r) => {
          toast.success("Password updated, please sign in again");
        });
      }
      router.refresh();
    },
    onError: () => {
      toast.error("Profile update failed");
    },
    onSettled: () => {
      setUpdating(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setUpdating(true);
    const data: any = {
      password: values.password === "" ? undefined : values.password,
      bio: values.bio,
    };

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        data.avatar = reader.result;
        updateUserById.mutate({ id, data });
      };
    } else {
      updateUserById.mutate({ id, data });
    }
  }

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
          <AvatarUploader
            value={file}
            onChange={setFile}
            fallback={username}
            avatar={avatar ?? ""}
            disabled={updating}
          />
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
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={updating}
                    placeholder="Tell us about yourself"
                    {...field}
                  />
                </FormControl>
                <FormDescription>A short bio about yourself</FormDescription>
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
