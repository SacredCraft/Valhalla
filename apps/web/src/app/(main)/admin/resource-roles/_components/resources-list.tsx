import React from "react";

import valhallaConfig from "@/config";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  Checkbox,
  FormDescription,
  FormLabel,
  ScrollArea,
  cn,
} from "@sacred-craft/valhalla-components";

type ResourceListProps = {
  selectedResources: string[];
  // eslint-disable-next-line no-unused-vars
  setSelectResources: (resource: string[]) => void;
  disabled?: boolean;
};

export const ResourcesList = ({
  selectedResources,
  setSelectResources,
  disabled,
}: ResourceListProps) => {
  const [value, setValue] = useControllableState<string[]>({
    prop: selectedResources,
    onChange: setSelectResources,
  });

  if (!value) {
    return null;
  }

  return (
    <div>
      <FormLabel>Resources</FormLabel>
      <ScrollArea className="-m-2 my-1">
        {valhallaConfig.resources.map((resource, index) => (
          <li
            key={index}
            className={cn("p-2 flex items-center gap-2 rounded-md", {
              "opacity-50": disabled,
            })}
          >
            {selectedResources.includes(resource.name)}
            <Checkbox
              checked={value.includes(resource.name)}
              onCheckedChange={(checked) =>
                setValue(
                  checked
                    ? [...value, resource.name]
                    : value.filter((v) => v !== resource.name),
                )
              }
              disabled={disabled}
            />
            <span className="text-sm font-medium">{resource.name}</span>
          </li>
        ))}
      </ScrollArea>
      <FormDescription>
        Select the resources that should be associated with this role.
      </FormDescription>
    </div>
  );
};
