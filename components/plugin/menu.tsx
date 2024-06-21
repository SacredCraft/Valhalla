"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useMemo } from "react";

import { usePluginContext } from "@/app/(main)/plugins/[plugin]/layout.client";
import { plugins } from "@/config/plugins";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Menu() {
  const { openedFiles } = usePluginContext();
  const pathname = usePathname();
  const plugin = useMemo(() => pathname.split("/")[2], [pathname]);
  const router = useRouter();

  return (
    <aside className="bg-background sm:flex h-full border-e sm:flex-col gap-y-2 w-[220px]">
      <div className="h-12 flex items-center justify-center border-b">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[200px] justify-between"
            >
              {plugin ? plugin : `Select plugin...`}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={`Search plugin...`} className="h-9" />
              <CommandList>
                <CommandEmpty>No plugin found.</CommandEmpty>
                <CommandGroup>
                  {plugins.map((item) => (
                    <CommandItem
                      value={item.id}
                      key={item.id}
                      onSelect={() => router.push(`/plugins/${item.id}`)}
                    >
                      {item.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          item.id === plugin ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        <p className="text-muted-foreground text-xs font-semibold uppercase px-3 mb-1 mt-2">
          Functions
        </p>
        <Item value="browser" label="Files Browser" />
        <Item value="settings" label="Plugin Settings" />
      </nav>
      <nav className="flex flex-col gap-1 px-2">
        <p className="text-muted-foreground text-xs font-semibold uppercase px-3 mb-1 mt-2">
          Files
        </p>
        <ScrollArea>
          {openedFiles?.map((file, _index, array) => {
            // 统计文件名在数组中出现的次数
            const duplicateCount = array.filter(
              (f) => f.name === file.name,
            ).length;
            // 如果文件名重复，显示路径
            const label =
              duplicateCount > 1
                ? `${file.name} (${file.path.join("/")})`
                : file.name;
            return (
              <Item
                key={file.path.join("/")}
                value={`files/${file.path.join("/")}`}
                label={label}
              />
            );
          })}
        </ScrollArea>
      </nav>
    </aside>
  );
}

function Item({ value, label }: { value: string; label: string }) {
  const pathname = usePathname();

  const isActive = useMemo(
    () =>
      value.includes("files")
        ? pathname.includes(value.split("/")[0]) &&
          pathname.includes(value.split("/").slice(1).join("/"))
        : pathname.split("/")[3] === value,
    [pathname, value],
  );

  return (
    <Button
      size="sm"
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start h-7"
      asChild
    >
      <Link href={`/plugins/${pathname.split("/")[2]}/${value}`}>
        {decodeURIComponent(label)}
      </Link>
    </Button>
  );
}
