"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Reorder } from "framer-motion";
import { X } from "lucide-react";
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

export function PluginMenu({ ownedPluginIds }: { ownedPluginIds: string[] }) {
  const { openedFiles, setOpenedFiles } = usePluginContext();
  const pathname = usePathname();
  const plugin = useMemo(() => pathname.split("/")[2], [pathname]);
  const router = useRouter();
  const ownedPlugins = useMemo(() => {
    return plugins.filter((plugin) => ownedPluginIds.includes(plugin.id));
  }, [ownedPluginIds]);

  return (
    <div className="w-[220px]">
      <div className="bg-background sm:flex border-e sm:flex-col gap-y-2 min-h-screen h-full">
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
                <CommandInput
                  placeholder={`Search plugin...`}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No plugin found.</CommandEmpty>
                  <CommandGroup>
                    {ownedPlugins.map((item) => (
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
          <p className="text-muted-foreground text-xs font-semibold uppercase px-2 mb-1 mt-2">
            Functions
          </p>
          <Item value="browser" label="Files Browser" />
        </nav>
        <nav className="flex flex-col gap-1 px-2 flex-1">
          <p className="text-muted-foreground text-xs font-semibold uppercase px-2 mb-1 mt-2">
            Files
          </p>
          <ScrollArea className="flex-1">
            <Reorder.Group
              axis="y"
              values={openedFiles}
              onReorder={setOpenedFiles}
            >
              {openedFiles?.map((file, index, array) => {
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
                  <Reorder.Item key={file.path.join("/")} value={file}>
                    <Item
                      index={index}
                      value={`files/${file.path.join("/")}`}
                      label={label}
                    />
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </ScrollArea>
        </nav>
      </div>
    </div>
  );
}

function Item({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index?: number;
}) {
  const { setOpenedFiles } = usePluginContext();
  const pathname = usePathname();

  const isActive = useMemo(
    () =>
      value.includes("files")
        ? decodeURIComponent(pathname).includes(value.split("/")[0]) &&
          decodeURIComponent(pathname).includes(
            value.split("/").slice(1).join("/"),
          )
        : pathname.split("/")[3] === value,
    [pathname, value],
  );

  return (
    <Button
      size="sm"
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start h-7 group px-2"
      asChild
    >
      <Link
        href={`/plugins/${pathname.split("/")[2]}/${value}`}
        draggable={false}
      >
        {decodeURIComponent(label)}
        {index !== undefined && (
          <span
            className="ml-auto group-hover:opacity-100 opacity-0 transition-all rounded-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 p-1"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenedFiles((prev) => prev?.filter((_, i) => i !== index));
            }}
          >
            <X className="size-3" />
          </span>
        )}
      </Link>
    </Button>
  );
}
