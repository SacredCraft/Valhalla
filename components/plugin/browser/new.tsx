"use client";

import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createFile } from "@/app/actions";
import { useBrowserContext } from "@/app/plugins/[plugin]/browser/layout.client";
import { usePluginContext } from "@/app/plugins/[plugin]/layout.client";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const FormSchema = z.object({
  name: z.string({
    message: "Name is required",
  }),
  type: z.literal("dir").or(z.literal("file")),
});

export function New() {
  const { plugin } = usePluginContext();
  const { relativePath, table } = useBrowserContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCreate = (data: z.infer<typeof FormSchema>) => {
    createFile(
      plugin.id,
      [relativePath?.join("/"), data.name].join("/"),
      data.type,
    ).then((success) => {
      table?.options.meta?.refresh();
      if (success) {
        toast.success("File created");
      } else {
        toast.error("Failed to create file");
      }
    });
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
          <SheetTitle>Create new file</SheetTitle>
          <SheetDescription>
            To create a new file, you need to complete the form below.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreate)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dir">Directory</SelectItem>
                        <SelectItem value="file">File</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of the file or directory.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the name of the file or directory.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <SheetClose>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <SheetClose>
                <Button type="submit">Create</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
