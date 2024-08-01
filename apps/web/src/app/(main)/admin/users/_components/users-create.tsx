import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createUserSchema } from "@/lib/zod";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AvatarUploader,
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  toast,
} from "@sacred-craft/valhalla-components";

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

  const createUser = api.users.createUser.useMutation({
    onSuccess: () => {
      toast.success("User created successfully!");
      form.reset();
      setFile(undefined);
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to create user.");
    },
    onSettled: () => {
      setCreating(false);
    },
  });

  function onSubmit(values: z.infer<typeof createUserSchema>) {
    setCreating(true);

    const create = (avatar: string | null) => {
      createUser.mutate({
        username: values.username,
        password: values.password,
        role: values.role,
        avatar: avatar,
      });
    };

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string" || reader.result === null) {
          create(reader.result);
        }
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
        <SheetHeader>
          <SheetTitle>Create User</SheetTitle>
          <SheetDescription>
            Fill out the form below to create a new user.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
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
            <SheetFooter className="mt-2">
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
