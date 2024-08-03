"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UsersList } from "@/app/(main)/_components/users-list";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
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

import { ResourcesList } from "./resources-list";

export const createResourceRoleSchema = z.object({
  role: z.string(),
  resources: z.array(z.string()),
  users: z.array(z.string()),
});

export const ResourceRolesCreate = () => {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const createResourceRole = api.resources.createResourceRole.useMutation({
    onSuccess: () => {
      toast.success("Resource role created");
      form.reset();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setCreating(false);
    },
  });

  const form = useForm<z.infer<typeof createResourceRoleSchema>>({
    resolver: zodResolver(createResourceRoleSchema),
    defaultValues: {
      role: "",
      resources: [],
      users: [],
    },
    disabled: creating,
  });

  const onSubmit = (values: z.infer<typeof createResourceRoleSchema>) => {
    setCreating(true);
    createResourceRole.mutate(values);
  };

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
          <SheetTitle>Create Resource Role</SheetTitle>
          <SheetDescription>
            Create a new resource role with the specified resources.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The role should be unique and descriptive.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resources"
                render={({ field }) => (
                  <ResourcesList
                    selectedResources={field.value}
                    setSelectResources={field.onChange}
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="users"
                render={({ field }) => (
                  <UsersList
                    users={field.value}
                    setUsers={field.onChange}
                    {...field}
                  />
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
