import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { string, z } from "zod";

import { updateUserById } from "@/service/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cell, flexRender } from "@tanstack/react-table";

import { UserCol } from "@/components/admin/users/users-table-columns";
import { AvatarUploader } from "@/components/ui/avatar-uploader";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { TableCell } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  username: string({ required_error: "Username is required" })
    .min(1, "Username is required")
    .max(16, "Username must be less than 16 characters"),
  password: z
    .string()
    .optional()
    .refine((val) => val === "" || (val !== undefined && val.length >= 8), {
      message: "Password must be at least 8 characters long if provided",
    }),
  role: z.enum(["ADMIN", "USER"]),
  bio: z.string().optional(),
});

export const UsersEdit = ({ cell }: { cell: Cell<UserCol, any> }) => {
  const [file, setFile] = useState<File>();
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: cell.row.original.username,
      password: "",
      role: cell.row.original.role,
      bio: cell.row.original.bio ?? undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setUpdating(true);
    const update = (fileData?: string | ArrayBuffer | null) => {
      updateUserById(cell.row.original.id, {
        ...values,
        password: values.password === "" ? undefined : values.password,
        avatar: fileData ? fileData : cell.row.original.avatar,
      }).then((r) => {
        if (r) {
          toast.success("User updated successfully!");
          setFile(undefined);
          router.refresh();
        } else {
          toast.error("Failed to update user.");
        }
        setUpdating(false);
      });
    };

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        update(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      update();
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <TableCell>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <SheetHeader>
              <SheetTitle>Edit User</SheetTitle>
              <SheetDescription>
                Edit user with id: {cell.row.original.id}
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <AvatarUploader
                fallback={cell.row.original.username}
                avatar={cell.row.original.avatar ?? ""}
                value={file}
                onChange={setFile}
                disabled={updating}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={updating}
                        placeholder="LioRael"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Username must be less than 16 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormDescription>
                      A short bio about yourself
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        disabled={updating}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem disabled={updating} value="ADMIN" />
                          </FormControl>
                          <FormLabel className="font-normal space-y-1">
                            <span>Admin</span>
                            <FormDescription>
                              Admins have access to all features.
                            </FormDescription>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem disabled={updating} value="USER" />
                          </FormControl>
                          <FormLabel className="font-normal space-y-1">
                            <span>User</span>
                            <FormDescription>
                              Users have limited access to features.
                            </FormDescription>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Edit</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
