import { defineValhallaConfig } from "@sacred-craft/valhalla-config";
import {
  Resource,
  Template,
  createTemplate,
} from "@sacred-craft/valhalla-resource";
import { common } from "@sacred-craft/valhalla-resource-common";

const resources: Resource[] = [common()];

const globalTemplates: Template[] = [
  createTemplate({
    name: "Image",
    options: {
      browser: {
        onClick: "preview-image",
      },
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
