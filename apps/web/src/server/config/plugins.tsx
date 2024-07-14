import { JormungandrDefault } from "@//components/templates/jormungandr/jormungandr-default";

import { ValhallaPlugin } from "./types";

export const plugins = [
  {
    id: "jormungandr",
    name: "Jormungandr",
    files: [
      {
        name: "config.yml",
        type: "file",
        templates: [
          {
            name: "JormungandrGlobalConfig",
            value: () => {},
            regex: ".*\\.ya?ml$",
          },
        ],
      },
      {
        name: "item",
        type: "dir",
        templates: [
          {
            name: "JormungandrDefault",
            value: JormungandrDefault,
            regex: ".*\\.ya?ml$",
          },
        ],
        files: [],
      },
    ],
  },
] as ValhallaPlugin[];
