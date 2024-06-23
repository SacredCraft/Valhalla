"use client";

import { useRouter } from "next/navigation";

import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { setPluginPath } from "@/app/actions";
import { plugins } from "@/config/plugins";

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

export const PluginPathForm = ({
  pluginPaths,
}: {
  pluginPaths: Map<string, string>;
}) => {
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
        <div className="border-b h-12 flex px-2 justify-between items-center relative">
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="h-7 px-2">
              <SaveIcon className="mr-1 w-4 h-4" />
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
