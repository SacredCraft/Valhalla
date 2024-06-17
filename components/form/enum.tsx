"use client";

import { useEditorContext } from "@/app/[plugin]/editor/[...path]/page.client";
import { getFormValue } from "@/lib/form";
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
} & React.HTMLProps<HTMLDivElement>;

export function Enum({
  description,
  defaultValue,
  label,
  className,
  items,
}: EnumProps) {
  const { form } = useEditorContext();
  const { node } = useNode();

  if (!node) {
    throw new Error("Enum component must be used within a node context.");
  }

  return (
    <FormField
      control={form.control}
      name={node}
      defaultValue={getFormValue(defaultValue)}
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
                    "w-[200px] justify-between",
                    !getFormValue(field.value) && "text-muted-foreground",
                  )}
                >
                  {getFormValue(field.value)
                    ? items.find(
                        (item) => item.value === getFormValue(field.value),
                      )?.label
                    : `Select ${label?.toString().toLowerCase()}...`}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder={`Search ${label?.toString().toLowerCase()}...`}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    No {label?.toString().toLowerCase()} found.
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
