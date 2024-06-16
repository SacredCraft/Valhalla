import { Candy } from "lucide-react";

import { JormungandrDefault } from "@/components/templates/jormungandr/jormungandr-default";

import { Plugin } from "./types";

export const plugins = [
  {
    id: "jormungandr",
    name: "Jormungandr",
    icon: Candy,
    files: [
      {
        name: "config.yml",
        type: "file",
        template: {
          name: "JormungandrGlobalConfig",
          value: () => {},
        },
      },
      {
        name: "item",
        type: "dir",
        template: {
          name: "JormungandrDefault",
          value: JormungandrDefault,
        },
        files: [],
      },
    ],
  },
] as Plugin[];
