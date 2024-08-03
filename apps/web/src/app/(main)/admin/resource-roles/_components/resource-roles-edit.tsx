"use client";

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
  TableCell,
  toast,
} from "@sacred-craft/valhalla-components";
import { Cell, flexRender } from "@tanstack/react-table";

import { RoleCol } from "./resource-roles-table-columns";
import { ResourcesList } from "./resources-list";

export const editResourceRoleSchema = z.object({
  roleId: z.number(),
  role: z.string(),
  resources: z.array(z.string()),
  users: z.array(z.string()),
});

export const ResourceRolesEdit = ({ cell }: { cell: Cell<RoleCol, any> }) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const editResourceRole = api.resources.updateResourceRole.useMutation({
    onSuccess: () => {
      toast.success("Resource role created");
      form.reset();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setEditing(false);
    },
  });

  const form = useForm<z.infer<typeof editResourceRoleSchema>>({
    resolver: zodResolver(editResourceRoleSchema),
    values: {
      roleId: cell.row.original.id,
      role: cell.row.original.role,
      resources: cell.row.original.resources,
      users: cell.row.original.users.map((user) => user.id),
    },
    disabled: editing,
  });

  const onSubmit = (values: z.infer<typeof editResourceRoleSchema>) => {
    setEditing(true);
    editResourceRole.mutate(values);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <TableCell>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Resource Role</SheetTitle>
          <SheetDescription>Edit the resource role below.</SheetDescription>
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
                <Button type="submit">Edit</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
