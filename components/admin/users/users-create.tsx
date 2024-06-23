import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createUserSchema } from "@/lib/zod";
import { createUser } from "@/service/user";
import { zodResolver } from "@hookform/resolvers/zod";

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

export const UsersCreate = () => {
  const [file, setFile] = useState<File>();
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof createUserSchema>) {
    setCreating(true);
    const create = (fileData?: string | ArrayBuffer | null) => {
      createUser(
        values.username,
        values.password,
        values.role,
        fileData ? fileData : null,
      ).then((r) => {
        if (r) {
          toast.success("User created successfully!");
          form.reset();
          setFile(undefined);
          router.refresh();
        } else {
          toast.error("Failed to create user.");
        }
        setCreating(false);
      });
    };

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        create(reader.result);
      };
    } else {
      create(null);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <Plus className="mr-1 h-4 w-4" />
          New
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <SheetHeader>
              <SheetTitle>Create User</SheetTitle>
              <SheetDescription>
                Fill out the form below to create a new user.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <AvatarUploader
                value={file}
                onChange={setFile}
                disabled={creating}
                fallback="Avatar"
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={creating}
                        placeholder="LioRael"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The username should be unique.
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
                        disabled={creating}
                        placeholder="········"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The password should be at least 8 characters long.
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
                        disabled={creating}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem disabled={creating} value="ADMIN" />
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
                            <RadioGroupItem disabled={creating} value="USER" />
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
                <Button type="submit">Create</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
