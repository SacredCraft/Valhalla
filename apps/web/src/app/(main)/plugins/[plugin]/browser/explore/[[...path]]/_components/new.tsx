"use client";

import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useBrowserContext } from "@/app/(main)/plugins/[plugin]/browser/layout.client";
import { usePluginContext } from "@/app/(main)/plugins/[plugin]/layout.client";
import { Button } from "@/app/_components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const createFile = api.files.createPluginFile.useMutation({
    onSuccess: () => {
      toast.success("File created");
      form.reset();
      table?.options.meta?.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreate = (data: z.infer<typeof FormSchema>) => {
    createFile.mutate({
      id: plugin.id,
      relativePath: [...relativePath!!, data.name],
      type: data.type,
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
