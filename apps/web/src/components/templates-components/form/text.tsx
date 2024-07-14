"use client";

import { useFilesEditorContext } from "@/app/(main)/plugins/[plugin]/files/editor/[...path]/layout.client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { getFormValue } from "@/lib/form";

import { useNode } from "@/components/templates-components/form/node";

type TextProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
} & React.ComponentProps<typeof Input>;

export function Text({
  description,
  label,
  defaultValue,
  className,
  ...rest
}: TextProps) {
  const { form } = useFilesEditorContext();
  const { node } = useNode();

  if (!node) {
    throw new Error("Text component must be used within a node context.");
  }

  return (
    <FormField
      name={node}
      control={form.control}
      defaultValue={getFormValue(defaultValue)}
      render={({ field: { value, ...field } }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              className="w-fit"
              value={getFormValue(value)}
              {...rest}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
