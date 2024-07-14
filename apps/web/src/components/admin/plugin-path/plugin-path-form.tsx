"use client";

import { SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { setPluginPath } from "@//app/actions";
import { Button } from "@//components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@//components/ui/form";
import { Input } from "@//components/ui/input";
import { plugins } from "@//server/config/plugins";

export const PluginPathForm = ({ pluginPaths }: { pluginPaths: Map }) => {
  const form = useForm({
    defaultValues: Object.fromEntries(
      Array.from(pluginPaths.entries()).map(([id, path]) => [id, path]),
    ),
  });

  const router = useRouter();

  function onSubmit(values: any) {
    for (const plugin of plugins) {
      const path = values[plugin.id];
      if (!path) {
        continue;
      }
      setPluginPath(plugin.id, path).then(() => {});
    }
    router.refresh();
    toast.success("Plugin paths updated.");
  }

  return (
    <Form {...form}>
      <form className="grid" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative flex h-12 items-center justify-between border-b px-2">
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="h-7 px-2">
              <SaveIcon className="mr-1 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
        {plugins.map((plugin) => (
          <div key={plugin.id} className="border-b p-2">
            <FormField
              control={form.control}
              name={plugin.id}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{plugin.name} Path</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`/server/plugins/${plugin.id}`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Configure the path where {plugin.name} will be edit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </form>
    </Form>
  );
};
