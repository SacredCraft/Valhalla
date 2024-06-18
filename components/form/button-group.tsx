"use client";

import React, { forwardRef } from "react";

import { useEditorContext } from "@/app/[plugin]/editor/[...path]/page.client";
import { getFormValue } from "@/lib/form";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

import { useNode } from "@/components/form/node";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

type ButtonGroupProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode[];
  defaultValue?: string | string[] | boolean;
  value?: string | string[] | boolean;
  onChange?: (value: string | string[] | boolean) => void;
  className?: string;
};

export function ButtonGroup({
  description,
  label,
  defaultValue,
  className,
  ...rest
}: ButtonGroupProps) {
  const { form } = useEditorContext();
  const { node } = useNode();

  if (!node) {
    throw new Error(
      "ButtonGroup component must be used within a node context.",
    );
  }

  return (
    <FormField
      defaultValue={getFormValue(defaultValue)}
      control={form.control}
      name={node}
      render={({ field: { value, ...field } }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <ButtonGroupPrimitive
              value={getFormValue(value)}
              {...rest}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}

const ButtonGroupPrimitive = forwardRef<
  HTMLDivElement,
  Partial<ButtonGroupProps>
>(
  (
    {
      children,
      value: propsValue,
      defaultValue: propsDefaultValue,
      onChange: onValueChange,
    },
    ref,
  ) => {
    const [value, setValue] = useControllableState<string | string[] | boolean>(
      {
        prop: propsValue,
        defaultProp: propsDefaultValue,
        onChange: onValueChange,
      },
    );

    const checkValue = (toChecked: any) => {
      switch (typeof value) {
        case "string":
          return toChecked === value;
        case "boolean":
          return toChecked === String(value);
        default:
          return toChecked === value;
      }
    };

    const handleValueChange = (newValue: any) => {
      switch (typeof value) {
        case "string":
          setValue(newValue);
          break;
        case "boolean":
          setValue(newValue === "true");
          break;
        default:
          setValue(newValue);
          break;
      }
    };

    const Items = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      return React.createElement(
        Button,
        {
          variant: checkValue(child.props.value) ? "default" : "outline",
          onClick: () => handleValueChange(child.props.value),
          type: "button",
        },
        child.props.children,
      );
    });

    return (
      <div
        ref={ref}
        className="group h-auto items-center justify-center"
        data-group="true"
        data-active={value}
      >
        {Items}
      </div>
    );
  },
);

ButtonGroupPrimitive.displayName = "ButtonGroup";
