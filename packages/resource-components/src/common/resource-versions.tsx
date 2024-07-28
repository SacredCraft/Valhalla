import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@sacred-craft/valhalla-components";

import { useResourceVersionsContext } from "../essential/providers";

export const ResourceVersions = () => {
  const { versions, currentVersion, setCurrentVersion } =
    useResourceVersionsContext();

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentVersion
            ? versions.find((version) => version.version === currentVersion)
                ?.version
            : "Select version..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandEmpty>No version found.</CommandEmpty>
          <CommandGroup>
            {versions.map((version) => (
              <CommandItem
                key={version.version}
                value={version.version}
                onSelect={(currentValue) => {
                  setCurrentVersion(
                    currentValue === currentVersion ? "" : currentValue,
                  );
                  setOpen(false);
                }}
              >
                {version.version}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    currentVersion === version.version
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
