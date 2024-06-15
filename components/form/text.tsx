"use client";

import { useContext } from "react";

import { EditorContext } from "@/app/[plugin]/editor/[...path]/page.client";
import { getFormValue } from "@/lib/form";

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
  node: string;
} & React.ComponentProps<typeof Input>;

export function Text({
  node,
  description,
  label,
  defaultValue,
  className,
  ...rest
}: TextProps) {
  const { form } = useContext(EditorContext);
  if (!form) {
    throw new Error("Text component must be used within a form context.");
  }
  return (
    <FormField
      control={form.control}
      name={node}
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
