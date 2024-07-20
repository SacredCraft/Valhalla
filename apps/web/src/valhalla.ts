import {
  Resource,
  Template,
  createResource,
  createTemplate,
  defineValhallaConfig,
} from "@sacred-craft/resource";

import { JormungandrDefault } from "@/components/templates/jormungandr/jormungandr-default";

const resources: Resource[] = [
  createResource({
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
  }),
];

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
});

export { valhallaConfig, resources, globalTemplates };
