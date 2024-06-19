"use client";

import { useEditorContext } from "@/app/plugins/[plugin]/editor/[...path]/page.client";
import { getFormValue } from "@/lib/form";

import { useNode } from "@/components/form/node";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
  const { form } = useEditorContext();
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
