"use client";

import { Reorder, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

import { useAside } from "@/app/(main)/_components/aside";
import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import valhallaConfig from "@/valhalla";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@sacred-craft/valhalla-components";

export function ResourceMenu({
  ownedResources: ownedResourcesNames,
}: {
  ownedResources: string[];
}) {
  const { collapsed } = useAside();
  const { openedFiles, setOpenedFiles } = useResourceContext();
  const pathname = usePathname();
  const resource = useMemo(() => pathname.split("/")[2], [pathname]);
  const router = useRouter();
  const ownedResources = useMemo(() => {
    return valhallaConfig.resources.filter((resource) =>
      ownedResourcesNames.includes(resource.name),
    );
  }, [ownedResourcesNames]);

  return (
    <motion.div
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      layout
      layoutDependency={collapsed}
      className="w-[220px] fixed left-[var(--aside-width)] h-screen"
    >
      <div className="bg-background sm:flex border-e sm:flex-col gap-y-2 min-h-screen h-full">
        <div className="h-12 flex items-center justify-center border-b">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-[200px] justify-between capitalize"
              >
                {resource ? resource : `Select resource...`}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder={`Search resource...`}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No resource found.</CommandEmpty>
                  <CommandGroup>
                    {ownedResources.map((item) => (
                      <CommandItem
                        className="capitalize"
                        value={item.name}
                        key={item.name}
                        onSelect={() => router.push(`/resources/${item.name}`)}
                      >
                        {item.name}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            item.name === resource
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
        </div>
        <nav className="flex flex-col gap-1 px-2">
          <p className="text-muted-foreground text-xs font-semibold uppercase px-2 mb-1 mt-2">
            Functions
          </p>
          <Item value="browser" label="Files Browser" />
        </nav>
        <nav className="flex flex-col gap-1 px-2 flex-1 overflow-y-scroll">
          <p className="text-muted-foreground text-xs font-semibold uppercase px-2 mb-1 mt-2">
            Files
          </p>
          <Reorder.Group
            className="overflow-scroll no-scrollbar flex-1"
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
        </nav>
      </div>
    </motion.div>
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
  const { setOpenedFiles } = useResourceContext();
  const pathname = usePathname();

  const isActive = useMemo(
    () =>
      value.includes("files")
        ? decodeURIComponent(pathname).includes(value?.split("/")[0] ?? "") &&
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
        href={`/resources/${pathname.split("/")[2]}/${value}`}
        draggable={false}
      >
        <span className="truncate">{decodeURIComponent(label)}</span>
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
