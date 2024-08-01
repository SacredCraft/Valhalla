"use client";

import { SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { api } from "@/trpc/react";
import valhallaConfig from "@/valhalla";
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
  toast,
} from "@sacred-craft/valhalla-components";

export const ResourcePathForm = ({
  resourcePaths,
}: {
  resourcePaths: Map<string, string>;
}) => {
  const form = useForm({
    defaultValues: Object.fromEntries(
      Array.from(resourcePaths.entries()).map(([name, path]) => [name, path]),
    ),
  });

  const router = useRouter();

  const setResourcePath = api.resources.setResourcePath.useMutation({
    onSuccess: () => {
      toast.success("Plugin path updated.");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update the plugin path.");
    },
  });

  function onSubmit(values: any) {
    for (const resource of valhallaConfig.resources) {
      const path = values[resource.name];
      if (!path) {
        continue;
      }
      setResourcePath.mutate({
        name: resource.name,
        path,
      });
    }
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
        {valhallaConfig.resources.map((resource) => (
          <div key={resource.name} className="border-b p-2">
            <FormField
              control={form.control}
              name={resource.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {resource.name} Path
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`/server/resources/${resource.name}`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Configure the path where {resource.name} will be edit.
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
