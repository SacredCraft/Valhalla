"use client";

import { KeyboardEvent, useEffect, useState } from "react";

import { useFilesEditorContext } from "@/app/(main)/plugins/[plugin]/files/editor/[...path]/layout.client";
import { getFormValue, isFormDeletableValue } from "@/lib/form";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { useNode } from "@/components/form/node";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type EnumProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  items: { label: string; value: string }[];
  defaultValue?: string;
  clearable?: boolean;
  creatable?: boolean;
} & React.HTMLProps<HTMLDivElement>;

export function Enum({
  description,
  defaultValue,
  label,
  className,
  items: originItems,
  clearable = true,
  creatable = false,
}: EnumProps) {
  const [items, setItems] =
    useState<{ label: string; value: string }[]>(originItems);
  const [inputValue, setInputValue] = useState<string>("");
  const { form } = useFilesEditorContext();
  const { node } = useNode();

  useEffect(() => {
    setItems(originItems);
  }, [originItems]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && creatable) {
      event.preventDefault();
      if (inputValue && node && !items.find((i) => i.value === inputValue)) {
        setItems((prev) => [
          ...prev,
          {
            label: inputValue,
            value: inputValue,
          },
        ]);
        form.setValue(node, inputValue);
        setInputValue("");
      }
    }
  };

  if (!node) {
    throw new Error("Enum component must be used within a node context.");
  }

  return (
    <FormField
      control={form.control}
      name={node}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className={cn(className, "flex flex-col")}>
          {label && <FormLabel>{label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[220px] justify-between",
                    !getFormValue(field.value) && "text-muted-foreground",
                  )}
                >
                  {!isFormDeletableValue(field.value) && field.value
                    ? items.find(
                        (item) => item.value === getFormValue(field.value),
                      )?.label || field.value
                    : `Select ${label?.toString().toLowerCase()}...`}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput
                  onKeyDown={handleKeyDown}
                  value={inputValue}
                  onValueChange={setInputValue}
                  placeholder={`Search ${label?.toString().toLowerCase()}...`}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    No {label?.toString().toLowerCase()} found.
                    <span className="block">Enter to create one.</span>
                  </CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={() => {
                          form.setValue(node, item.value);
                        }}
                      >
                        {item.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            item.value === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {clearable && field.value && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            form.setValue(node, null);
                          }}
                        >
                          Clear
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}
