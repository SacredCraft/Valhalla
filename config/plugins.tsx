import { Candy } from "lucide-react";

import { JormungandrDefault } from "@/components/templates/jormungandr/jormungandr-default";
import { Button } from "@/components/ui/button";

export const plugins = [
  {
    id: "jormungandr",
    name: "Jormungandr",
    icon: Candy,
    dirs: [
      { id: "root", name: "Root" },
      {
        id: "display",
        name: "Display",
      },
      {
        id: "item",
        name: "Item",
        template: JormungandrDefault,
        actions: (
          <div className="flex flex-col gap-2">
            <Button>Add Item</Button>
            <Button>Delete All</Button>
          </div>
        ),
        relations: {
          enable: true,
          value: {
            type: "dir",
            ids: ["item"],
          },
        },
      },
    ],
  },
] as Plugin[];

export type Plugin = {
  id: string;
  name: string;
  icon: React.ElementType;
  dirs: PluginDir[];
};

export type PluginDir = {
  id: string;
  name: string;
  files?: PluginFile[];
  template?: React.ElementType;
  actions?: React.ReactNode;
  relations?: Relations;
};

export type Relations =
  | {
      enable: false;
    }
  | {
      enable: true;
      value: { type: "dir" | "file"; ids: string[] }[];
    };

export type PluginFile = {
  id: string;
  name: string;
  template: React.ElementType;
  actions?: React.ReactNode;
  relations?: Relations;
};

export function getPlugin(id: string) {
  return plugins.find((plugin) => plugin.id === id);
}

export function getTemplateAndActions(
  pluginId: string,
  dirId: string,
  fileId: string,
) {
  const plugin = getPlugin(pluginId);
  if (!plugin) {
    return;
  }

  const dir = plugin.dirs.find((dir) => dir.id === dirId);
  if (!dir) {
    return;
  }
  if (dir.template) {
    return {
      template: dir.template,
      actions: dir.actions,
    };
  }

  const file = dir.files?.find((file) => file.id === fileId);
  if (!file) {
    return;
  }

  return {
    template: file.template,
    actions: file.actions,
  };
}
