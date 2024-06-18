import React from "react";

import { cn } from "@/lib/utils";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

export type InputProps = {
  value?: string | number | readonly string[] | undefined | null;
  defaultValue?: string | number | readonly string[] | undefined | null;
  onChange?: (value: string | number | readonly string[] | undefined) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      value: propsValue,
      defaultValue: propsDefaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useControllableState<
      string | number | readonly string[] | undefined
    >({
      prop: propsValue,
      defaultProp: propsDefaultValue,
      onChange,
    });

    return (
      <input
        value={value ?? ""}
        onChange={(e) => {
          if (typeof value === "number") {
            setValue(Number(e.target.value));
          } else {
            setValue(e.target.value);
          }
        }}
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
