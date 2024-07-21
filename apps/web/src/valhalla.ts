import React from "react";

import {
  Resource,
  Template,
  createResource,
  createTemplate,
} from "@sacred-craft/resource";
import { defineValhallaConfig } from "@sacred-craft/valhalla-config";

const jormungandr = createResource({
  name: "jormungandr",
  templates: [
    createTemplate({
      name: "JormungandrDefault",
      matchedPaths: ["item/.*\\.ya?ml$"],
      action: {
        render: {
          editor: () => React.createElement("div", null, "Jormungandr Editor"),
        },
      },
    }),
  ],
});

const resources: Resource[] = [jormungandr()];

const globalTemplates: Template[] = [
  createTemplate({
    name: "Image",
    action: {
      preview: "image",
    },
    matchedPaths: [".*\\.(png|jpe?g|gif|svg)$"],
  }),
];

const valhallaConfig = defineValhallaConfig({
  resources,
  globalTemplates,
  dateOptions: {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  },
});

export default valhallaConfig;
