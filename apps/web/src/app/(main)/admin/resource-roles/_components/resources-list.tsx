import React, { Dispatch, SetStateAction, useState } from "react";

import valhallaConfig from "@/config";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormDescription,
  FormLabel,
  Input,
  ScrollArea,
} from "@sacred-craft/valhalla-components";

type ResourceListProps = {
  selectedResources: string[];
  // eslint-disable-next-line no-unused-vars
  setSelectResources: (resource: string[]) => void;
};

export const ResourcesList = ({
  selectedResources,
  setSelectResources,
}: ResourceListProps) => {
  const [value, setValue] = useControllableState<string[]>({
    prop: selectedResources,
    onChange: setSelectResources,
  });
  const [search, setSearch] = useState("");

  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <FormLabel>Resources</FormLabel>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search resources"
          className="h-8"
          value={search}
          onChange={(value) => setSearch(value as string)}
        />
        <AddResource setResources={setValue} ids={value} />
      </div>
      <ScrollArea className="flex flex-col gap-2 border rounded-md p-2">
        {selectedResources.length > 0 ? (
          <div className="flex flex-col gap-2">
            {selectedResources.map((resource, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{resource}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setValue(value.filter((v) => v !== resource));
                  }}
                >
                  Remove
                </Button>
              </li>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground min-h-20 flex items-center justify-center">
            No resources found
          </div>
        )}
      </ScrollArea>
      <FormDescription>
        Select the resources that should be associated with this role.
      </FormDescription>
    </div>
  );
};

export const AddResource = ({
  ids,
  setResources,
}: {
  ids: string[] | undefined;
  setResources: Dispatch<SetStateAction<string[] | undefined>>;
}) => {
  const [search, setSearch] = useState("");

  const resources = valhallaConfig.resources.filter((resource) =>
    resource.name.includes(search),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Resource</DialogTitle>
          <DialogDescription>
            Search for a resource to add to this role.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Search resources"
          className="h-8"
          value={search}
          onChange={(value) => setSearch(value as string)}
        />
        <ScrollArea className="border rounded-md p-2">
          {resources && resources.length > 0 ? (
            <div className="flex flex-col gap-2">
              {resources.map((resource, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{resource.name}</span>
                  </div>
                  {ids?.includes(resource.name) ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setResources((prev) =>
                          prev?.filter((id) => id !== resource.name),
                        );
                      }}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setResources((prev) => [
                          ...(prev ?? []),
                          resource.name,
                        ]);
                      }}
                    >
                      Add
                    </Button>
                  )}
                </li>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground min-h-20 flex items-center justify-center">
              No resources found
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
