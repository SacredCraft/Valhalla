"use client";

import { Reorder, motion } from "framer-motion";
import { Circle, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

import { useAside } from "@/app/(main)/_components/aside";
import { useResourceContext } from "@/app/(main)/resources/[resource]/files/[[...slug]]/layout.client";
import valhallaConfig from "@/config";
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
  toast,
} from "@sacred-craft/valhalla-components";

import { FileContextMenu } from "./file-context-menu";

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
          <Item value="/files" label="Files" keyword="files" />
          <Item value="/trash" label="Trash" keyword="trash" />
          <Item value="/starred" label="Starred" keyword="starred" />
        </nav>
        <nav className="flex flex-col gap-1 px-2 flex-1 overflow-y-scroll no-scrollbar">
          <p className="text-muted-foreground text-xs font-semibold uppercase px-2 mb-1 mt-2">
            Files
          </p>
          <Reorder.Group
            className="overflow-scroll flex-1"
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
                  <FileContextMenu path={file.path}>
                    <Item
                      index={index}
                      value={`/files/${file.path.join("/")}`}
                      label={label}
                    />
                  </FileContextMenu>
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
  keyword,
}: {
  value: string;
  label: string;
  index?: number;
  keyword?: string;
}) {
  const { openedFiles, setOpenedFiles } = useResourceContext();
  const pathname = usePathname();

  const isActive = useMemo(() => {
    const decodedPathname = decodeURIComponent(pathname);
    if (keyword) {
      return decodedPathname.includes(keyword);
    }
    return decodedPathname.includes(value);
  }, [pathname, keyword]);

  const file = index !== undefined ? openedFiles[index] : undefined;

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
            className={cn(
              "ml-auto group-hover:opacity-100 opacity-0 transition-all rounded-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 p-1",
              file?.isModified ? "opacity-60" : "opacity-0",
            )}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (file?.isModified) {
                toast.error("Please save the file before closing it.");
              } else {
                setOpenedFiles((prev) =>
                  prev?.filter((file, i) => i !== index || file.isModified),
                );
              }
            }}
          >
            {file?.isModified ? (
              <Circle className="size-2 fill-current" />
            ) : (
              <X className="size-3" />
            )}
          </span>
        )}
      </Link>
    </Button>
  );
}
