import {
  Resource,
  Template,
  createResource,
  createTemplate,
  defineValhallaConfig,
} from "@sacred-craft/resource";

import { JormungandrDefault } from "@/components/templates/jormungandr/jormungandr-default";

const jormungandr = createResource({
  name: "jormungandr",
  templates: [
    createTemplate({
      name: "JormungandrDefault",
      matchedPaths: ["item/.*\\.ya?ml$"],
      action: {
        render: {
          editor: JormungandrDefault,
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
